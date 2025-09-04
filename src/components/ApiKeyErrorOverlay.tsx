import React from 'react';

export const ApiKeyErrorOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900 bg-opacity-80 backdrop-blur-sm">
      <div className="w-full max-w-2xl p-8 m-4 bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-700">
        <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Configuration Error</h1>
            <p className="mt-2 text-base text-zinc-600 dark:text-zinc-300">
              The Google Gemini API key has not been configured for this application.
            </p>
        </div>

        <div className="mt-6 p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm">
            <h2 className="font-semibold text-zinc-800 dark:text-zinc-200">How to Fix</h2>
            
            <div className="mt-3">
              <h3 className="font-semibold text-zinc-700 dark:text-zinc-300">For Local Development:</h3>
              <ol className="list-decimal list-inside mt-1 space-y-1 text-zinc-600 dark:text-zinc-400">
                <li>Create a file named <code className="font-mono text-xs bg-zinc-200 dark:bg-zinc-700 px-1 py-0.5 rounded">.env</code> in the project's root directory.</li>
                <li>Add the following line to the file, replacing the placeholder with your key:</li>
              </ol>
              <pre className="mt-2 p-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-md text-xs overflow-x-auto">
                <code className="font-mono">VITE_API_KEY="YOUR_GEMINI_API_KEY_HERE"</code>
              </pre>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-zinc-700 dark:text-zinc-300">For Vercel Deployment:</h3>
              <ol className="list-decimal list-inside mt-1 space-y-1 text-zinc-600 dark:text-zinc-400">
                <li>Go to your project's dashboard on Vercel.</li>
                <li>Navigate to <span className="font-semibold">Settings &gt; Environment Variables</span>.</li>
                <li>Add a new variable with the following details:</li>
              </ol>
                <div className="mt-2 grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-xs">
                    <span className="font-semibold text-zinc-600 dark:text-zinc-400">Name:</span>
                    <code className="font-mono bg-zinc-200 dark:bg-zinc-700 px-1 py-0.5 rounded">VITE_API_KEY</code>
                    <span className="font-semibold text-zinc-600 dark:text-zinc-400">Value:</span>
                    <code className="font-mono bg-zinc-200 dark:bg-zinc-700 px-1 py-0.5 rounded">[Your actual Gemini API key]</code>
                </div>
            </div>
            <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-500">After adding the key, you will need to restart your local development server or redeploy on Vercel for the change to take effect.</p>
        </div>
      </div>
    </div>
  );
};