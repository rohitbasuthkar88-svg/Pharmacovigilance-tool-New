import React from 'react';
import type { InteractionResult } from '../types';
import { PillsIcon } from './icons';

interface InteractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  result: InteractionResult | null;
  error: string | null;
}

const getSeverityColor = (severity: string) => {
  const sev = severity.toLowerCase();
  if (sev === 'major') return 'bg-rose-100 border-rose-500 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300 dark:border-rose-700';
  if (sev === 'moderate') return 'bg-amber-100 border-amber-500 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-700';
  if (sev === 'minor') return 'bg-cyan-100 border-cyan-500 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300 dark:border-cyan-700';
  return 'bg-zinc-100 border-zinc-500 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200 dark:border-zinc-600';
};

export const InteractionModal: React.FC<InteractionModalProps> = ({ isOpen, onClose, isLoading, result, error }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-white dark:bg-zinc-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fadeInUp"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        style={{ animationDuration: '300ms' }}
      >
        <header className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center space-x-3">
            <PillsIcon className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Drug Interaction Report</h2>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors rounded-full" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>

        <main className="p-6 overflow-y-auto">
          {isLoading && (
            <div className="text-center py-10">
              <svg className="animate-spin h-10 w-10 text-teal-600 dark:text-teal-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-4 text-zinc-600 dark:text-zinc-300 font-semibold">The AI is checking for interactions...</p>
            </div>
          )}
          {error && (
            <div className="text-center py-10">
              <div className="mx-auto w-16 h-16 text-red-500 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-2">An Error Occurred</h3>
              <p className="text-zinc-600 dark:text-zinc-300 bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-500/30">{error}</p>
            </div>
          )}
          {result && !isLoading && (
            result.length > 0 ? (
              <div className="space-y-4">
                {result.map((interaction, index) => (
                  <div key={index} className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                        <h4 className="font-bold text-zinc-800 dark:text-zinc-100 text-lg">{interaction.drugA} + {interaction.drugB}</h4>
                        <p className={`text-sm font-bold px-3 py-1 rounded-full border whitespace-nowrap ${getSeverityColor(interaction.severity)}`}>
                          {interaction.severity}
                        </p>
                    </div>
                    <p className="text-zinc-700 dark:text-zinc-300">{interaction.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="mx-auto w-16 h-16 text-green-500 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">No Significant Interactions Found</h3>
                <p className="text-zinc-600 dark:text-zinc-300">The AI did not identify any clinically significant interactions among the provided medications.</p>
              </div>
            )
          )}
        </main>
        
        <footer className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-700 text-right">
            <button 
              onClick={onClose} 
              className="px-6 py-2 bg-zinc-600 dark:bg-zinc-700 text-white font-semibold rounded-md shadow-sm hover:bg-zinc-700 dark:hover:bg-zinc-600 transition"
            >
              Close
            </button>
        </footer>
      </div>
    </div>
  );
};