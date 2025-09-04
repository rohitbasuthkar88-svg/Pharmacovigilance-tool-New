import React from 'react';
import { InfoIcon } from './icons';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
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
        className="bg-white dark:bg-zinc-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col animate-fadeInUp"
        onClick={(e) => e.stopPropagation()}
        style={{ animationDuration: '300ms' }}
      >
        <header className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center space-x-3">
            <InfoIcon className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">About This Tool</h2>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors rounded-full" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>

        <main className="p-6 overflow-y-auto prose prose-zinc dark:prose-invert max-w-none">
            <p>
                This <strong>ICSR Causality Assessment Tool</strong> was designed and developed to demonstrate the power of generative AI in the pharmacovigilance space. It acts as an expert assistant to drug safety professionals, streamlining the complex process of causality assessment.
            </p>
            <h3 className="text-zinc-700 dark:text-zinc-200">Creator Information</h3>
            <p>
                [<strong>Your Name / Company Name Here</strong>]
                <br />
                [Your Title / Role]
                <br />
                <a href="[Your Website/LinkedIn URL]" target="_blank" rel="noopener noreferrer">your-website.com</a>
            </p>
            <p>
                Feel free to replace this text with your own information, a project description, or details about your organization. This modal is a great place to add a personal touch to the application.
            </p>
            <h3 className="text-zinc-700 dark:text-zinc-200">Disclaimer</h3>
            <p className="text-sm">
                This tool is for informational and demonstrational purposes only and does not constitute medical advice. The AI-generated assessments should be reviewed and verified by a qualified healthcare professional.
            </p>
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