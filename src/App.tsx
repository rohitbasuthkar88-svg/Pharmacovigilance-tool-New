import React, { useState, useCallback, useEffect } from 'react';
import { CaseInputForm } from './components/CaseInputForm';
import { AssessmentResult } from './components/AssessmentResult';
import { AboutModal } from './components/AboutModal';
import { assessCausality, isApiKeyConfigured } from './services/geminiService';
import { ApiKeyErrorOverlay } from './components/ApiKeyErrorOverlay';
import type { CaseData, AssessmentResult as AssessmentResultType } from './types';
import { BrainCircuitIcon, SunIcon, MoonIcon } from './components/icons';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  // Check for the API key at the start of the render.
  // This value is determined at build time and will not change.
  if (!isApiKeyConfigured()) {
    // If the key is missing, render the overlay and prevent the app from loading further.
    return <ApiKeyErrorOverlay />;
  }

  const [assessmentResult, setAssessmentResult] = useState<AssessmentResultType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleFormSubmit = useCallback(async (data: CaseData) => {
    setIsLoading(true);
    setError(null);
    setAssessmentResult(null);
    try {
      const result = await assessCausality(data);
      setAssessmentResult(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200 font-sans transition-colors duration-300">
        <header className="bg-white dark:bg-zinc-800/50 backdrop-blur-sm shadow-sm border-b border-zinc-200 dark:border-zinc-700 sticky top-0 z-10 transition-colors duration-300">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BrainCircuitIcon className="w-8 h-8 text-teal-600 dark:text-teal-400" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-zinc-800 dark:text-zinc-100">ICSR Causality Assessment Tool</h1>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">Powered by AI Expert Drug Safety Physician</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-zinc-800 transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
            </button>
          </div>
        </header>
        <main className="container mx-auto p-4 sm:p-6 lg:p-8 opacity-0 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
            {/* Left Column: Input Form */}
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-sm transition-colors duration-300">
              <CaseInputForm onSubmit={handleFormSubmit} isLoading={isLoading} />
            </div>

            {/* Right Column: Assessment Result */}
            <div className="mt-8 lg:mt-0">
              <div className="sticky top-28 bg-white dark:bg-zinc-800 p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-sm min-h-[600px] flex items-center justify-center transition-colors duration-300">
                <AssessmentResult result={assessmentResult} isLoading={isLoading} error={error} />
              </div>
            </div>
          </div>
        </main>
        <footer className="text-center py-6 text-sm text-zinc-500 dark:text-zinc-400 transition-colors duration-300">
          <p>This tool is for informational purposes only and does not constitute medical advice.</p>
          <div className="mt-2 space-x-4">
            <span>&copy; 2024 AI Innovations in Pharmacovigilance</span>
            <button onClick={() => setIsAboutModalOpen(true)} className="hover:text-teal-600 dark:hover:text-teal-400 hover:underline transition">
              About this Tool
            </button>
          </div>
        </footer>
      </div>
      <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
    </>
  );
};

export default App;