import React from 'react';
import { Download, Monitor, Settings, Plug, Rocket, Sparkles, Chrome, CheckCircle2 } from 'lucide-react';

export default function ExtensionSetup() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-slide-up">
      {/* Header Banner */}
      <div className="glass-card p-8 flex flex-col md:flex-row items-center justify-between overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 via-blue-600/10 to-transparent pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-primary-400" />
            <span className="text-sm text-primary-400 font-bold uppercase tracking-widest text-shadow-sm">ApplyMate Desktop</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Extension Setup</h1>
          <p className="text-dark-300 max-w-xl text-sm leading-relaxed mb-6">
            Get the most out of ApplyMate by installing our desktop Chrome extension. Automatically fill out complex job applications with a single click and land your dream job faster.
          </p>
          
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold shadow-lg shadow-primary-600/30 transition-all transform hover:-translate-y-1">
            <Download className="w-5 h-5" />
            1-Click Download Extension
          </button>
        </div>
        
        <div className="hidden md:flex shrink-0 relative mt-6 md:mt-0 p-4 border border-dark-600 rounded-2xl bg-dark-800/50 backdrop-blur-md shadow-2xl">
          <Monitor className="w-16 h-16 text-blue-500 animate-pulse" />
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary-400" />
          Step-by-Step Installation
        </h2>
        <p className="text-dark-300 text-sm">Follow these simple steps to install the ApplyMate extension on your desktop browser.</p>
      </div>

      {/* Steps List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Step 1 */}
        <div className="glass-card p-6 border-l-4 border-l-blue-500 hover:bg-dark-800/40 transition-colors relative overflow-hidden group">
          <div className="absolute top-4 right-4 text-6xl font-black text-dark-800/50 group-hover:text-dark-700/50 transition-colors z-0 select-none">1</div>
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
              <Download className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Download the Extension</h3>
            <p className="text-sm text-dark-300">
              Click the "1-Click Download Extension" button above. The extension will be saved to your computer as a `.zip` file. Extract the folder to a convenient location on your desktop.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="glass-card p-6 border-l-4 border-l-green-500 hover:bg-dark-800/40 transition-colors relative overflow-hidden group">
          <div className="absolute top-4 right-4 text-6xl font-black text-dark-800/50 group-hover:text-dark-700/50 transition-colors z-0 select-none">2</div>
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
              <Settings className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Open Extensions Settings</h3>
            <p className="text-sm text-dark-300">
              In your Chrome browser, type <code className="text-primary-300 bg-dark-900 px-2 py-0.5 rounded">chrome://extensions/</code> into the address bar and press Enter. This will open the extensions management page.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="glass-card p-6 border-l-4 border-l-purple-500 hover:bg-dark-800/40 transition-colors relative overflow-hidden group">
          <div className="absolute top-4 right-4 text-6xl font-black text-dark-800/50 group-hover:text-dark-700/50 transition-colors z-0 select-none">3</div>
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
              <Plug className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Enable Developer Mode</h3>
            <p className="text-sm text-dark-300">
              In the top right corner of the extensions page, toggle the <strong>Developer mode</strong> switch to the ON position. This allows you to load unpacked extensions.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="glass-card p-6 border-l-4 border-l-pink-500 hover:bg-dark-800/40 transition-colors relative overflow-hidden group">
          <div className="absolute top-4 right-4 text-6xl font-black text-dark-800/50 group-hover:text-dark-700/50 transition-colors z-0 select-none">4</div>
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-4">
              <Rocket className="w-6 h-6 text-pink-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Load the Extension</h3>
            <p className="text-sm text-dark-300">
              Click the <strong>Load unpacked</strong> button that appears in the top left corner. Select the extracted ApplyMate folder from Step 1. You're all set!
            </p>
          </div>
        </div>
      </div>
      
      {/* Success Box */}
      <div className="glass-card p-6 border-dashed border-2 border-green-500/30 bg-green-900/5 flex items-center gap-4 mt-8">
        <div className="shrink-0">
          <CheckCircle2 className="w-10 h-10 text-green-400" />
        </div>
        <div>
          <h4 className="text-white font-bold mb-1">Ready to Apply!</h4>
          <p className="text-sm text-dark-300">
            Once installed, click the ApplyMate icon in your browser toolbar while on any supported job board (Workday, Lever, Greenhouse, etc.) to autofill your application instantly!
          </p>
        </div>
      </div>
    </div>
  );
}
