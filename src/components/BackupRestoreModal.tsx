import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import {
  Download,
  Upload,
  Database,
  X,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

interface BackupRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const BackupRestoreModal: React.FC<BackupRestoreModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  if (!isOpen) return null;

  // 1. Download full JSON backup
  const handleDownloadBackup = async () => {
    try {
      setLoading(true);
      setStatusMessage(null);

      // Fetch all transactions and budgets
      const [txRes, bgRes] = await Promise.all([
        api.get('/transactions'),
        api.get('/budgets'),
      ]);

      const backupData = {
        app: 'FinTrack',
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        transactions: txRes.data,
        budgets: bgRes.data,
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `FinTrack_Backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setStatusMessage({
        text: language === 'hi' ? 'बैकअप फ़ाइल डाउनलोड हो गई!' : 'Backup file downloaded successfully!',
      });
    } catch (err: any) {
      setStatusMessage({
        text: language === 'hi' ? 'बैकअप डाउनलोड करने में विफलता' : 'Failed to export backup',
        isError: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // 2. Restore from JSON file
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setStatusMessage(null);

      const text = await file.text();
      const parsed = JSON.parse(text);

      if (!parsed.transactions || !Array.isArray(parsed.transactions)) {
        setStatusMessage({
          text: language === 'hi' ? 'अमान्य बैकअप फ़ाइल' : 'Invalid backup file format',
          isError: true,
        });
        setLoading(false);
        return;
      }

      // Restore transactions
      let restoredCount = 0;
      for (const tx of parsed.transactions) {
        try {
          await api.post('/transactions', {
            title: tx.title,
            amount: tx.amount,
            type: tx.type,
            category: tx.category,
            date: tx.date,
            paymentMethod: tx.paymentMethod || 'UPI',
            description: tx.description || '',
          });
          restoredCount++;
        } catch (e) {
          // ignore single failures
        }
      }

      // Restore budgets if present
      if (parsed.budgets && Array.isArray(parsed.budgets)) {
        for (const bg of parsed.budgets) {
          try {
            await api.post('/budgets', {
              category: bg.category,
              amount: bg.amount,
              month: bg.month,
              year: bg.year,
            });
          } catch (e) {
            // ignore
          }
        }
      }

      setStatusMessage({
        text: language === 'hi'
          ? `${restoredCount} लेन-देन सफलतापूर्वक रीस्टोर हुए!`
          : `Restored ${restoredCount} transactions successfully!`,
      });
      onSuccess();
    } catch (err: any) {
      setStatusMessage({
        text: language === 'hi' ? 'फ़ाइल पढ़ने में त्रुटि' : 'Failed to restore backup file',
        isError: true,
      });
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              {language === 'hi' ? 'डेटा बैकअप एवं रीस्टोर' : 'Data Backup & Restore'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <p className="text-xs text-slate-600 leading-relaxed">
            {language === 'hi'
              ? 'आपका वित्तीय डेटा पूरी तरह आपका है। आप कभी भी अपना पूरा डेटा डाउनलोड कर सकते हैं या किसी अन्य डिवाइस में रीस्टोर कर सकते हैं।'
              : 'Your financial data is 100% yours. Export a complete JSON backup anytime, or restore it onto another device with zero data loss.'}
          </p>

          {statusMessage && (
            <div
              className={`p-3 rounded-xl flex items-center space-x-2 text-xs font-semibold ${
                statusMessage.isError
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              {statusMessage.isError ? (
                <AlertCircle className="w-4 h-4 shrink-0" />
              ) : (
                <CheckCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Action 1: Download Backup */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800">
                {language === 'hi' ? 'पूरा डेटा बैकअप लें (JSON)' : 'Download Backup File'}
              </p>
              <p className="text-[11px] text-slate-500">
                {language === 'hi' ? 'सभी खर्च, आय और बजट सुरक्षित रखें' : 'Saves all transactions and budgets to disk'}
              </p>
            </div>
            <button
              onClick={handleDownloadBackup}
              disabled={loading}
              className="inline-flex items-center space-x-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'डाउनलोड' : 'Export'}</span>
            </button>
          </div>

          {/* Action 2: Restore from Backup */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800">
                {language === 'hi' ? 'बैकअप से रीस्टोर करें' : 'Restore from Backup File'}
              </p>
              <p className="text-[11px] text-slate-500">
                {language === 'hi' ? 'पहले ली गई JSON फ़ाइल अपलोड करें' : 'Upload a previously exported JSON backup'}
              </p>
            </div>
            <label className="inline-flex items-center space-x-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors shrink-0 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'अपलोड' : 'Import'}</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                disabled={loading}
                className="hidden"
              />
            </label>
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              {language === 'hi' ? 'बंद करें' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
