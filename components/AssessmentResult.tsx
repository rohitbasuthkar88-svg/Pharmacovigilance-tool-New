import React from 'react';
import type { AssessmentResult as AssessmentResultType } from '../types';
import { BrainCircuitIcon, BeakerIcon } from './icons';

interface AssessmentResultProps {
  result: AssessmentResultType | null;
  isLoading: boolean;
  error: string | null;
}

const WelcomeMessage: React.FC = () => (
  <div className="text-center p-8">
    <BrainCircuitIcon className="w-20 h-20 text-teal-500 dark:text-teal-400 mx-auto mb-4 animate-pulse" />
    <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">AI Causality Assessment</h2>
    <p className="text-zinc-600 dark:text-zinc-300 max-w-md mx-auto">
      Enter the case details on the left to begin. The AI will analyze the information and provide a causality assessment for each drug-event pair.
    </p>
  </div>
);

const LoadingIndicator: React.FC = () => (
  <div className="text-center p-8 animate-pulse">
    <BeakerIcon className="w-20 h-20 text-zinc-400 dark:text-zinc-500 mx-auto mb-4" />
    <h2 className="text-2xl font-bold text-zinc-600 dark:text-zinc-300 mb-2">Analyzing Case...</h2>
    <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
      The expert AI is evaluating the temporal relationship, dechallenge/rechallenge data, and clinical context. Please wait.
    </p>
  </div>
);

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
  <div className="text-center p-8">
    <div className="mx-auto w-20 h-20 text-red-500 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    </div>
    <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">An Error Occurred</h2>
    <p className="text-zinc-600 dark:text-zinc-300 bg-red-50 dark:bg-red-900/20 p-4 rounded-md border border-red-200 dark:border-red-500/30">
      {message}
    </p>
  </div>
);

const getCategoryColor = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('probable') || cat.includes('likely')) return 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-900/50 dark:text-teal-300 dark:border-teal-700';
  if (cat.includes('possible')) return 'bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-900/50 dark:text-cyan-300 dark:border-cyan-700';
  if (cat.includes('unlikely')) return 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-700';
  if (cat.includes('unrelated') || cat.includes('not related')) return 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900/50 dark:text-rose-300 dark:border-rose-700';
  return 'bg-zinc-100 text-zinc-800 border-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:border-zinc-600';
};

export const AssessmentResult: React.FC<AssessmentResultProps> = ({ result, isLoading, error }) => {
  if (isLoading) {
    return <LoadingIndicator />;
  }
  if (error) {
    return <ErrorDisplay message={error} />;
  }
  if (!result) {
    return <WelcomeMessage />;
  }
  if (result.length === 0) {
    return (
       <div className="text-center p-8">
           <BrainCircuitIcon className="w-20 h-20 text-zinc-500 mx-auto mb-4" />
           <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">Assessment Incomplete</h2>
           <p className="text-zinc-600 dark:text-zinc-300 max-w-md mx-auto">
           The AI was unable to generate a specific causality assessment for the provided data. Please check the inputs or try again.
           </p>
       </div>
    );
 }

  return (
    <div className="p-4 w-full h-full overflow-y-auto space-y-6 bg-white dark:bg-zinc-800 rounded-lg">
      <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-700 pb-3 opacity-0 animate-fadeInUp">Detailed Causality Assessments</h2>
      {result.map((assessment, index) => (
        <div 
          key={index} 
          className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-sm opacity-0 animate-fadeInUp"
          style={{ animationDelay: `${(index + 1) * 150}ms` }}
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2">
            <div className="flex-grow">
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
                <span className="font-normal text-zinc-600 dark:text-zinc-400 block sm:inline">Drug:</span> {assessment.drugName}
              </h3>
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
                <span className="font-normal text-zinc-600 dark:text-zinc-400 block sm:inline">Event:</span> {assessment.adverseEvent}
              </h3>
            </div>
            <p className={`text-base font-bold px-3 py-1 rounded-full text-center border whitespace-nowrap ${getCategoryColor(assessment.causalityCategory)}`}>
              {assessment.causalityCategory}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-2">Rationale</h4>
            <div className="prose prose-zinc dark:prose-invert max-w-none text-sm">
              <p className="whitespace-pre-wrap">{assessment.rationale}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};