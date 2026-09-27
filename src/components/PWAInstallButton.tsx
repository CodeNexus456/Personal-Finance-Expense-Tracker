import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, Share2, PlusSquare } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'navbar' | 'banner' | 'card';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'navbar', className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, don't show prompt
  if (isInstalled) {
    return null;
  }

  // If not on iOS and browser hasn't fired beforeinstallprompt yet, we can still render a friendly button
  const handleAction = () => {
    if (isInstallable) {
      install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // In browsers where beforeinstallprompt already fired or is desktop Chrome
      install();
    }
  };

  return (
    <>
      {variant === 'navbar' && (
        <button
          onClick={handleAction}
          title="Install FinTrack on your phone or PC"
          className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors shadow-2xs ${className}`}
        >
          <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
          <span>Install App</span>
        </button>
      )}

      {variant === 'banner' && (
        <div className={`p-3 bg-gradient-to-r from-indigo-50 via-slate-50 to-emerald-50 rounded-xl border border-indigo-100 flex items-center justify-between shadow-2xs ${className}`}>
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Use FinTrack Anytime on Mobile</p>
              <p className="text-xs text-slate-500">Install to your phone home screen for 1-tap quick expense logging</p>
            </div>
          </div>
          <button
            onClick={handleAction}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors shadow-2xs"
          >
            Install Now
          </button>
        </div>
      )}

      {/* iOS Installation Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Install on iPhone / iPad</h3>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Apple Safari lets you install FinTrack directly without the App Store:
            </p>

            <ol className="space-y-2.5 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <li className="flex items-start space-x-2">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-xs">1</span>
                <span>Tap the <Share2 className="w-3.5 h-3.5 inline mx-1 text-indigo-600" /> <strong>Share</strong> button at bottom of Safari.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-xs">2</span>
                <span>Scroll down and select <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-emerald-600" /> <strong>Add to Home Screen</strong>.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-xs">3</span>
                <span>Tap <strong>Add</strong> in the top-right corner. Done!</span>
              </li>
            </ol>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
