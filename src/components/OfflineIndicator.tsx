import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useLanguage } from '../context/LanguageContext';
import { WifiOff, ShieldCheck } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { language } = useLanguage();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 md:bottom-5 left-4 right-4 md:right-auto md:left-5 z-50 flex items-center justify-between space-x-3 bg-amber-600 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold animate-pulse">
      <div className="flex items-center space-x-2">
        <WifiOff className="w-4 h-4 shrink-0" />
        <span>
          {language === 'hi'
            ? 'ऑफ़लाइन मोड: इंटरनेट नहीं है, फिर भी आप खर्च जोड़ सकते हैं। डेटा फोन में सुरक्षित रहेगा।'
            : 'Offline Mode: No connection. You can still add expenses safely; data is stored locally.'}
        </span>
      </div>
    </div>
  );
};
