import React from 'react';
import {
  Wallet,
  ArrowRight,
  TrendingUp,
  PieChart,
  ShieldCheck,
  PiggyBank,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Smartphone,
  WifiOff,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { PWAInstallButton } from '../components/PWAInstallButton';

interface HomeProps {
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigateToLogin, onNavigateToRegister }) => {
  const { demoLogin } = useAuth();
  const { t, language } = useLanguage();
  const [demoLoading, setDemoLoading] = React.useState(false);

  const handleDemo = async () => {
    setDemoLoading(true);
    await demoLogin();
    setDemoLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full text-indigo-700 text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>
              {language === 'hi'
                ? '📱 PWA + ऑफ़लाइन सक्षम • कभी भी, कहीं भी इस्तेमाल करें'
                : '📱 PWA + Offline Ready • Use Anytime, Anywhere'}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {language === 'hi' ? (
              <>
                अपने पैसों और खर्चों का हिसाब रखें,{' '}
                <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">
                  आसानी से और कभी भी।
                </span>
              </>
            ) : (
              <>
                Take control of your personal money,{' '}
                <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">
                  anytime & everywhere.
                </span>
              </>
            )}
          </h1>

          <p className="mt-5 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {language === 'hi'
              ? 'दुकान, ऑटो या सफर में 1-टैप में खर्च दर्ज करें। बिना इंटरनेट भी काम करता है और सीधे आपके फोन की होम स्क्रीन पर ऐप की तरह इंस्टॉल हो जाता है।'
              : 'Log daily expenses in seconds, monitor monthly budgets, and analyze spending habits even when offline. Install directly to your phone screen like a native app.'}
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onNavigateToRegister}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base shadow-sm transition-all"
            >
              <span>{t.register}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onNavigateToLogin}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-base transition-colors"
            >
              {t.login}
            </button>

            <button
              onClick={handleDemo}
              disabled={demoLoading}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold text-sm transition-colors"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{demoLoading ? 'Logging into Demo...' : t.tryDemo}</span>
            </button>
          </div>

          <div className="mt-4 flex items-center justify-center space-x-2">
            <PWAInstallButton variant="navbar" />
          </div>

          <p className="mt-3 text-xs text-slate-400">
            {language === 'hi'
              ? 'बिना किसी परेशानी के तुरंत इस्तेमाल शुरू करें। निजी और सुरक्षित।'
              : 'No credit card or banking credentials required. Safe, private & instant.'}
          </p>

          {/* Live Preview Strip */}
          <div className="mt-10 max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-md p-4 sm:p-6 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                <span className="text-xs text-slate-400 font-mono ml-2">fintrack.app</span>
              </div>
              <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-semibold flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>{language === 'hi' ? 'ऑफ़लाइन व ऑनलाइन तैयार' : 'Online & Offline Ready'}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <p className="text-xs text-slate-500 font-medium">{t.totalBalance}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">₹49,501</p>
                <div className="flex items-center text-xs text-emerald-600 mt-1 font-medium">
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                  <span>{language === 'hi' ? 'सकारात्मक बचत' : 'Healthy positive net'}</span>
                </div>
              </div>

              <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200/60">
                <p className="text-xs text-emerald-800 font-medium">{t.totalIncome}</p>
                <p className="text-2xl font-bold text-emerald-700 mt-1">₹80,000</p>
                <div className="flex items-center text-xs text-emerald-600 mt-1 font-medium">
                  <span>{language === 'hi' ? 'वेतन + फ्रीलांसिंग' : 'Salary + Freelancing'}</span>
                </div>
              </div>

              <div className="bg-rose-50/70 p-4 rounded-xl border border-rose-200/60">
                <p className="text-xs text-rose-800 font-medium">{t.totalExpenses}</p>
                <p className="text-2xl font-bold text-rose-700 mt-1">₹30,499</p>
                <div className="flex items-center text-xs text-rose-600 mt-1 font-medium">
                  <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                  <span>{language === 'hi' ? 'बजट के भीतर' : 'Within monthly limits'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {language === 'hi' ? 'हर रोज कभी भी इस्तेमाल के लिए खास फीचर्स' : 'Built for effortless, anytime usage'}
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
              {language === 'hi'
                ? 'सिर्फ एक वेबसाइट नहीं, बल्कि एक असली पॉकेट ऐप जो हमेशा आपके साथ रहता है।'
                : 'Not just a website, but a true pocket utility ready whenever you make an expense.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 text-base mb-1">
                {language === 'hi' ? '1-टैप क्विक खर्चा' : '1-Tap Fast Logger'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'hi'
                  ? 'चाय, ऑटो, किराना जैसे रोज के खर्च सिर्फ एक क्लिक में तुरंत दर्ज करें।'
                  : 'Log recurring chai, snacks, auto, and recharge expenses with single-click shortcuts.'}
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 text-base mb-1">
                {language === 'hi' ? 'मोबाइल PWA ऐप' : 'Installable PWA'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'hi'
                  ? 'बिना प्ले स्टोर के सीधे फोन स्क्रीन पर इंस्टॉल करें। तेज और हल्का।'
                  : 'Install directly to Android or iOS home screens without app store downloads.'}
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                <WifiOff className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 text-base mb-1">
                {language === 'hi' ? 'ऑफ़लाइन मोड' : 'Offline Persistence'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'hi'
                  ? 'नेटवर्क ना होने पर भी ऐप खुलेगा और खर्च फोन में सुरक्षित रहेगा।'
                  : 'No internet connection? FinTrack keeps working smoothly using local storage.'}
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 text-base mb-1">
                {language === 'hi' ? 'डेटा बैकअप व गोपनीयता' : 'Backup & Privacy'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'hi'
                  ? 'अपना पूरा डेटा कभी भी JSON/CSV में डाउनलोड करें और दूसरे फोन में डालें।'
                  : 'Export complete JSON backups and CSV sheets anytime for 100% data ownership.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center space-x-2">
            <Wallet className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold text-slate-700">FinTrack</span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>PWA & Offline Ready</span>
            <span>&bull;</span>
            <span>Node.js / Express</span>
            <span>&bull;</span>
            <span>JWT & Bcrypt</span>
            <span>&bull;</span>
            <span>Bilingual (EN / हिंदी)</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
