import React, { useState, useCallback, useMemo } from 'react';
import type { CaseData, AdverseEventItem, InteractionResult, SuspectDrugItem } from '../types';
import { checkInteractions } from '../services/geminiService';
import { InteractionModal } from './InteractionModal';

interface CaseInputFormProps {
  onSubmit: (data: CaseData) => void;
  isLoading: boolean;
}

const initialFormState: CaseData = {
  narrative: '',
  suspectDrugs: [{ drugName: '', startDate: '', stopDate: '' }],
  adverseEvents: [{ eventName: '', onsetDate: '', resolutionDate: '' }],
  patientHistory: '',
  dechallengeOutcome: '',
  rechallengeOutcome: '',
  alternativeCauses: '',
  concomitantMeds: '',
  labData: '',
};

export const CaseInputForm: React.FC<CaseInputFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<CaseData>(initialFormState);
  
  // State for DDI Modal
  const [isCheckingInteractions, setIsCheckingInteractions] = useState(false);
  const [interactionResult, setInteractionResult] = useState<InteractionResult | null>(null);
  const [interactionError, setInteractionError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStandardChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);
  
  const handleSuspectDrugChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    fieldName: keyof SuspectDrugItem
  ) => {
    const newSuspectDrugs = [...formData.suspectDrugs];
    newSuspectDrugs[index] = { ...newSuspectDrugs[index], [fieldName]: e.target.value };
    setFormData(prev => ({ ...prev, suspectDrugs: newSuspectDrugs }));
  }, [formData.suspectDrugs]);

  const handleAdverseEventChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    fieldName: keyof AdverseEventItem
  ) => {
    const newAdverseEvents = [...formData.adverseEvents];
    newAdverseEvents[index] = { ...newAdverseEvents[index], [fieldName]: e.target.value };
    setFormData(prev => ({ ...prev, adverseEvents: newAdverseEvents }));
  }, [formData.adverseEvents]);


  const addArrayItem = useCallback((fieldName: 'suspectDrugs' | 'adverseEvents') => {
    if (fieldName === 'suspectDrugs') {
      setFormData(prev => ({ ...prev, suspectDrugs: [...prev.suspectDrugs, { drugName: '', startDate: '', stopDate: '' }] }));
    } else {
      setFormData(prev => ({ ...prev, adverseEvents: [...prev.adverseEvents, { eventName: '', onsetDate: '', resolutionDate: '' }] }));
    }
  }, []);

  const removeArrayItem = useCallback((index: number, fieldName: 'suspectDrugs' | 'adverseEvents') => {
    if (fieldName === 'suspectDrugs') {
      if (formData.suspectDrugs.length > 1) {
        const newValues = formData.suspectDrugs.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, suspectDrugs: newValues }));
      }
    } else {
      if (formData.adverseEvents.length > 1) {
        const newValues = formData.adverseEvents.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, adverseEvents: newValues }));
      }
    }
  }, [formData.suspectDrugs, formData.adverseEvents]);

  const handleClear = () => {
    setFormData(initialFormState);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedData = {
      ...formData,
      narrative: formData.narrative.trim(),
      suspectDrugs: formData.suspectDrugs
        .map(d => ({ ...d, drugName: d.drugName.trim() }))
        .filter(d => d.drugName),
      adverseEvents: formData.adverseEvents
        .map(a => ({ ...a, eventName: a.eventName.trim() }))
        .filter(a => a.eventName),
    };
    onSubmit(cleanedData);
  };

  const handleCheckInteractions = async () => {
    setIsModalOpen(true);
    setIsCheckingInteractions(true);
    setInteractionResult(null);
    setInteractionError(null);

    const suspectedDrugs = formData.suspectDrugs.map(d => d.drugName.trim()).filter(Boolean);
    const concomitant = formData.concomitantMeds.trim().split(/[,;\n]/).map(d => d.trim()).filter(Boolean);
    const allDrugs = [...new Set([...suspectedDrugs, ...concomitant])];

    if (allDrugs.length < 2) {
      setInteractionError("Please provide at least two drugs to check for interactions.");
      setIsCheckingInteractions(false);
      return;
    }

    try {
      const result = await checkInteractions(allDrugs);
      setInteractionResult(result);
    } catch (err) {
      if (err instanceof Error) {
        setInteractionError(err.message);
      } else {
        setInteractionError("An unknown error occurred while checking interactions.");
      }
    } finally {
      setIsCheckingInteractions(false);
    }
  };

  const isStructuredDataEmpty = formData.suspectDrugs.every(d => d.drugName.trim() === '') || formData.adverseEvents.every(a => a.eventName.trim() === '');
  const isNarrativeEmpty = !formData.narrative || formData.narrative.trim() === '';
  const isSubmitDisabled = (isNarrativeEmpty && isStructuredDataEmpty) || isLoading;
  
  const totalDrugsForInteractionCheck = useMemo(() => {
    const suspected = formData.suspectDrugs.map(d => d.drugName.trim()).filter(Boolean);
    const concomitant = formData.concomitantMeds.trim().split(/[,;\n]/).map(d => d.trim()).filter(Boolean);
    return new Set([...suspected, ...concomitant]).size;
  }, [formData.suspectDrugs, formData.concomitantMeds]);
  const isInteractionCheckDisabled = totalDrugsForInteractionCheck < 2 || isCheckingInteractions;

  const inputClass = "w-full p-2 bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-teal-500 dark:focus:border-teal-400 transition duration-150 ease-in-out placeholder:text-zinc-400 dark:placeholder:text-zinc-500";
  const labelClass = "block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1";
  const sectionClass = "bg-white dark:bg-zinc-800 p-4 rounded-lg";

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={sectionClass}>
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-2">Case Narrative</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">Provide a full case narrative. The AI will extract details from it automatically. If used, the structured fields below are optional.</p>
          <textarea
            id="narrative"
            name="narrative"
            value={formData.narrative}
            onChange={handleStandardChange}
            className={`${inputClass} min-h-[150px] font-mono text-sm`}
            rows={6}
            placeholder="e.g., A 65-year-old male with a history of hyperlipidemia was started on Atorvastatin 40mg daily. Two weeks later, he developed severe muscle pain (myalgia)..."
          ></textarea>
        </div>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-zinc-300 dark:border-zinc-700"></div>
          <span className="flex-shrink mx-4 text-zinc-500 dark:text-zinc-400 font-semibold text-sm">OR ENTER STRUCTURED DATA</span>
          <div className="flex-grow border-t border-zinc-300 dark:border-zinc-700"></div>
        </div>
        
        <div className={sectionClass}>
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-4 border-b border-zinc-200 dark:border-zinc-700 pb-2">Suspect Drug(s) & Timeline*</h3>
          <div className="space-y-4">
            {formData.suspectDrugs.map((drug, index) => (
              <div key={index} className="p-3 bg-zinc-50 dark:bg-zinc-700/50 rounded-md border border-zinc-200 dark:border-zinc-600 space-y-3">
                <div className="flex items-center space-x-2">
                  <input type="text" value={drug.drugName} onChange={(e) => handleSuspectDrugChange(e, index, 'drugName')} className={inputClass} placeholder="e.g., Atorvastatin" required={isNarrativeEmpty && index === 0} />
                  {formData.suspectDrugs.length > 1 && (
                    <button type="button" onClick={() => removeArrayItem(index, 'suspectDrugs')} className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-500 transition-colors rounded-full" aria-label="Remove drug">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor={`drugStartDate-${index}`} className={labelClass}>Start Date</label>
                        <input type="date" id={`drugStartDate-${index}`} value={drug.startDate} onChange={(e) => handleSuspectDrugChange(e, index, 'startDate')} className={`${inputClass} dark:[color-scheme:dark]`} />
                    </div>
                    <div>
                        <label htmlFor={`drugStopDate-${index}`} className={labelClass}>Stop/Dose-reduction Date</label>
                        <input type="date" id={`drugStopDate-${index}`} value={drug.stopDate} onChange={(e) => handleSuspectDrugChange(e, index, 'stopDate')} className={`${inputClass} dark:[color-scheme:dark]`} />
                    </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('suspectDrugs')} className="text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 transition-colors">+ Add Drug</button>
          </div>
        </div>
        
        <div className={sectionClass}>
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-4 border-b border-zinc-200 dark:border-zinc-700 pb-2">Adverse Event(s)*</h3>
          <div className="space-y-4">
              {formData.adverseEvents.map((event, index) => (
                <div key={index} className="p-3 bg-zinc-50 dark:bg-zinc-700/50 rounded-md border border-zinc-200 dark:border-zinc-600 space-y-3">
                  <div className="flex items-center space-x-2">
                    <input type="text" value={event.eventName} onChange={(e) => handleAdverseEventChange(e, index, 'eventName')} className={inputClass} placeholder="e.g., Myalgia" required={isNarrativeEmpty && index === 0} />
                    {formData.adverseEvents.length > 1 && (
                      <button type="button" onClick={() => removeArrayItem(index, 'adverseEvents')} className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-500 transition-colors rounded-full" aria-label="Remove event">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                          <label htmlFor={`eventOnsetDate-${index}`} className={labelClass}>Event Onset Date</label>
                          <input type="date" id={`eventOnsetDate-${index}`} value={event.onsetDate} onChange={(e) => handleAdverseEventChange(e, index, 'onsetDate')} className={`${inputClass} dark:[color-scheme:dark]`} />
                      </div>
                      <div>
                          <label htmlFor={`eventResolutionDate-${index}`} className={labelClass}>Event Resolution Date</label>
                          <input type="date" id={`eventResolutionDate-${index}`} value={event.resolutionDate} onChange={(e) => handleAdverseEventChange(e, index, 'resolutionDate')} className={`${inputClass} dark:[color-scheme:dark]`} />
                      </div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('adverseEvents')} className="text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 transition-colors">+ Add Event</button>
          </div>
        </div>

        <div className={sectionClass}>
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-4 border-b border-zinc-200 dark:border-zinc-700 pb-2">Dechallenge & Rechallenge</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dechallengeOutcome" className={labelClass}>Dechallenge Outcome</label>
              <select id="dechallengeOutcome" name="dechallengeOutcome" value={formData.dechallengeOutcome} onChange={handleStandardChange} className={inputClass}>
                <option value="">Select...</option>
                <option value="Resolved">Event Resolved</option>
                <option value="Improved">Event Improved</option>
                <option value="Unchanged">Event Unchanged</option>
                <option value="Worsened">Event Worsened</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>
            <div>
              <label htmlFor="rechallengeOutcome" className={labelClass}>Rechallenge Outcome</label>
              <select id="rechallengeOutcome" name="rechallengeOutcome" value={formData.rechallengeOutcome} onChange={handleStandardChange} className={inputClass}>
                <option value="">Select...</option>
                <option value="Reappeared">Event Reappeared</option>
                <option value="Did not reappear">Event Did Not Reappear</option>
                <option value="Not applicable">Not Applicable</option>
              </select>
            </div>
          </div>
        </div>

        <div className={sectionClass}>
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-4 border-b border-zinc-200 dark:border-zinc-700 pb-2">Clinical Context</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="patientHistory" className={labelClass}>Relevant Patient Medical History</label>
              <textarea id="patientHistory" name="patientHistory" value={formData.patientHistory} onChange={handleStandardChange} className={inputClass} rows={3} placeholder="e.g., Pre-existing renal impairment, history of allergies..."></textarea>
            </div>
            <div>
              <label htmlFor="alternativeCauses" className={labelClass}>Alternative Causes for the Event(s)</label>
              <textarea id="alternativeCauses" name="alternativeCauses" value={formData.alternativeCauses} onChange={handleStandardChange} className={inputClass} rows={3} placeholder="e.g., Viral infection, underlying disease progression..."></textarea>
            </div>
            <div>
              <div className="flex justify-between items-center">
                <label htmlFor="concomitantMeds" className={labelClass}>Concomitant Medications</label>
                <button 
                  type="button" 
                  onClick={handleCheckInteractions} 
                  disabled={isInteractionCheckDisabled}
                  className="px-3 py-1 text-xs font-semibold text-white bg-teal-600 dark:bg-teal-500 rounded-md shadow-sm hover:bg-teal-700 dark:hover:bg-teal-600 disabled:bg-teal-300 dark:disabled:bg-teal-800 dark:disabled:text-zinc-400 disabled:cursor-not-allowed transition"
                >
                  {isCheckingInteractions ? 'Checking...' : 'Check Interactions'}
                </button>
              </div>
              <textarea id="concomitantMeds" name="concomitantMeds" value={formData.concomitantMeds} onChange={handleStandardChange} className={inputClass} rows={3} placeholder="List other medications the patient was taking..."></textarea>
            </div>
            <div>
              <label htmlFor="labData" className={labelClass}>Relevant Laboratory Data</label>
              <textarea id="labData" name="labData" value={formData.labData} onChange={handleStandardChange} className={inputClass} rows={3} placeholder="e.g., LFTs: ALT 150 U/L (baseline 25), Creatinine: 2.1 mg/dL (baseline 0.9)..."></textarea>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-end space-x-4 pt-4">
          <button type="button" onClick={handleClear} disabled={isLoading} className="px-6 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md text-zinc-700 dark:text-zinc-200 font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-50 transition">
            Clear Form
          </button>
          <button type="submit" disabled={isSubmitDisabled} className="px-6 py-2 bg-teal-600 dark:bg-teal-500 text-white font-semibold rounded-md shadow-md hover:bg-teal-700 dark:hover:bg-teal-600 disabled:bg-teal-300 dark:disabled:bg-teal-800 dark:disabled:text-zinc-400 disabled:cursor-not-allowed transition flex items-center">
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Assessing...
              </>
            ) : 'Assess Causality'}
          </button>
        </div>
      </form>

      <InteractionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isLoading={isCheckingInteractions}
        result={interactionResult}
        error={interactionError}
      />
    </>
  );
};