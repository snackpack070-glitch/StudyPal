import React from 'react';
import { 
  Sparkles, 
  Camera, 
  BrainCircuit, 
  BookOpenCheck, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Lock,
  UserCheck,
  HelpCircle,
  FileSearch,
  Sparkle,
  ShoppingCart,
  ExternalLink,
  Home,
  User as UserIcon,
  Mail
} from 'lucide-react';
import { User } from 'firebase/auth';
import AdSenseBanner from './AdSenseBanner';
import ScanToPayQRCode from './ScanToPayQRCode';
import ThemeToggle from './ThemeToggle';
import SocialShare from './SocialShare';
import StudyPalLogo from './StudyPalLogo';

interface LandingPageProps {
  user: User | null;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onEnterApp: () => void;
  onSignOut: () => void;
  onOpenLegal?: (tab: 'terms' | 'privacy') => void;
  onOpenAbout?: () => void;
  onOpenContact?: () => void;
}

export default function LandingPage({
  user,
  onOpenAuth,
  onEnterApp,
  onSignOut,
  onOpenLegal,
  onOpenAbout,
  onOpenContact
}: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-sky-50/50 to-slate-100 dark:from-blue-950 dark:via-blue-900 dark:to-slate-900 text-slate-900 dark:text-white flex flex-col transition-colors duration-300">
      {/* Header / Nav */}
      <header className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-5 sm:py-6 flex items-center justify-between border-b border-slate-200/60 dark:border-blue-900/40">
        <StudyPalLogo size="md" />

        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Home navigation button */}
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs sm:text-sm font-bold text-slate-700 dark:text-blue-100 hover:text-blue-950 dark:hover:text-yellow-400 flex items-center space-x-1.5 px-3 py-2 rounded-xl hover:bg-slate-200/50 dark:hover:bg-blue-900/40 transition-colors cursor-pointer"
            title="Go to Home"
          >
            <Home className="w-4 h-4 text-yellow-500" />
            <span className="hidden sm:inline">Home</span>
          </button>

          {/* About Me navigation button */}
          <button
            onClick={onOpenAbout}
            id="nav-about-button"
            className="text-xs sm:text-sm font-bold text-slate-700 dark:text-blue-100 hover:text-blue-950 dark:hover:text-yellow-400 flex items-center space-x-1.5 px-3 py-2 rounded-xl hover:bg-slate-200/50 dark:hover:bg-blue-900/40 transition-colors cursor-pointer"
            title="About the Creator"
          >
            <UserIcon className="w-4 h-4 text-blue-500 dark:text-yellow-400" />
            <span>About Me</span>
          </button>

          {/* Contact navigation button */}
          <button
            onClick={onOpenContact}
            id="nav-contact-button"
            className="text-xs sm:text-sm font-bold text-slate-700 dark:text-blue-100 hover:text-blue-950 dark:hover:text-yellow-400 flex items-center space-x-1.5 px-3 py-2 rounded-xl hover:bg-slate-200/50 dark:hover:bg-blue-900/40 transition-colors cursor-pointer"
            title="Contact StudyPal"
          >
            <Mail className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            <span>Contact</span>
          </button>

          {/* Theme Toggle in Header */}
          <ThemeToggle variant="pill" showLabels={true} className="hidden md:inline-flex" />
          <ThemeToggle variant="button" className="md:hidden" />

          {user ? (
            <div className="flex items-center space-x-3 bg-blue-50 dark:bg-blue-900/80 border border-blue-200 dark:border-blue-700/60 rounded-full py-1.5 px-4 shadow-xs">
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full border border-yellow-400" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-yellow-400 text-blue-950 font-bold flex items-center justify-center text-xs">
                  {user.displayName?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              <span className="text-xs font-semibold text-slate-800 dark:text-blue-100 hidden sm:inline">
                {user.displayName || user.email}
              </span>
              <button
                onClick={onSignOut}
                className="text-xs text-blue-900 dark:text-yellow-400 hover:underline font-bold ml-2 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={() => onOpenAuth('signin')}
                className="text-xs sm:text-sm font-bold text-slate-700 dark:text-blue-100 hover:text-blue-950 dark:hover:text-white px-3 py-2 cursor-pointer transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="text-xs sm:text-sm font-extrabold bg-yellow-400 hover:bg-yellow-300 text-blue-950 px-4 py-2 rounded-xl shadow-md cursor-pointer transition-all hover:scale-105"
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 flex flex-col items-center text-center">
        <div className="inline-flex items-center space-x-2 bg-yellow-400/15 dark:bg-yellow-400/10 border border-yellow-500/40 dark:border-yellow-400/30 rounded-full px-4 py-1.5 mb-6 text-yellow-800 dark:text-yellow-300 text-xs font-bold tracking-wide shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-400" />
          <span>Your 24/7 study coach that explains the next step, checks your work, and helps you learn it yourself.</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-950 dark:text-white tracking-tight leading-tight max-w-3xl">
          Master Any Subject with <span className="text-blue-900 dark:text-yellow-400">Instant AI Explanations</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-blue-200 max-w-2xl leading-relaxed font-normal">
          Snap a photo or paste any math, science, or literature problem. Get clear step-by-step solutions, key formula breakdowns, and instant practice quizzes.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
          <button
            onClick={onEnterApp}
            className="w-full sm:w-auto px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-black text-base rounded-2xl shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 group cursor-pointer hover:scale-105"
          >
            <span>Launch Workspace</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          {!user && (
            <button
              onClick={() => onOpenAuth('signup')}
              className="w-full sm:w-auto px-7 py-4 bg-white dark:bg-blue-900/60 hover:bg-slate-100 dark:hover:bg-blue-800/80 border border-slate-300 dark:border-blue-700/60 text-slate-800 dark:text-white font-bold text-base rounded-2xl transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer shadow-sm hover:scale-105"
            >
              <Lock className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
              <span>Sign Up</span>
            </button>
          )}
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-16 w-full text-left">
          <div className="text-center mb-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-yellow-700 dark:text-yellow-400">Simple & Intuitive Workflow</h2>
            <p className="text-2xl font-extrabold text-slate-950 dark:text-white mt-1">How StudyPal Works in 3 Steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-white/90 dark:bg-blue-900/40 border border-slate-200/90 dark:border-blue-800/80 p-6 rounded-2xl shadow-sm flex flex-col space-y-4 hover:border-yellow-500/50 dark:hover:border-yellow-400/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-yellow-400/20 dark:bg-yellow-400/10 border border-yellow-500/30 dark:border-yellow-400/30 text-yellow-700 dark:text-yellow-400 flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-bold text-lg">
                <Camera className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <h3>Upload or Type</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-blue-200 leading-relaxed">
                Take a quick photo of your textbook question, worksheet, or handwritten problem, or enter the text manually.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white/90 dark:bg-blue-900/40 border border-slate-200/90 dark:border-blue-800/80 p-6 rounded-2xl shadow-sm flex flex-col space-y-4 hover:border-yellow-500/50 dark:hover:border-yellow-400/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-yellow-400/20 dark:bg-yellow-400/10 border border-yellow-500/30 dark:border-yellow-400/30 text-yellow-700 dark:text-yellow-400 flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-bold text-lg">
                <BrainCircuit className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <h3>Step-by-Step AI Logic</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-blue-200 leading-relaxed">
                StudyPal analyzes the problem, breaks down the core concepts, and delivers step-by-step reasoning so you learn *how* to solve it.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white/90 dark:bg-blue-900/40 border border-slate-200/90 dark:border-blue-800/80 p-6 rounded-2xl shadow-sm flex flex-col space-y-4 hover:border-yellow-500/50 dark:hover:border-yellow-400/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-yellow-400/20 dark:bg-yellow-400/10 border border-yellow-500/30 dark:border-yellow-400/30 text-yellow-700 dark:text-yellow-400 flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-bold text-lg">
                <BookOpenCheck className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <h3>Practice & Retain</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-blue-200 leading-relaxed">
                Save solved questions to your history, review concept flashcards, and test your mastery with personalized practice quizzes.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Sample Demo Card */}
        <div className="mt-16 w-full max-w-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-blue-800/80 rounded-2xl p-6 sm:p-8 text-left shadow-xl dark:shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-blue-800/60 mb-6">
            <div className="flex items-center space-x-2">
              <Sparkle className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
              <span className="text-sm font-bold text-slate-900 dark:text-white">Live AI Solution Preview</span>
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 bg-yellow-400/20 text-yellow-800 dark:text-yellow-300 rounded-md border border-yellow-400/30">
              Mathematics Example
            </span>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-50 dark:bg-blue-950/80 border border-slate-200 dark:border-blue-800/60 p-4 rounded-xl">
              <span className="text-xs font-semibold text-blue-900 dark:text-blue-300 uppercase block mb-1">Problem Query</span>
              <p className="text-sm font-medium text-slate-800 dark:text-white">"Solve for x: 3x + 15 = 45 and explain the mathematical rule."</p>
            </div>

            <div className="bg-amber-50/50 dark:bg-blue-900/40 border border-amber-200/60 dark:border-blue-800/60 p-4 rounded-xl space-y-2">
              <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400 uppercase block">AI Step-by-Step Explanation</span>
              <ul className="text-xs text-slate-700 dark:text-blue-100 space-y-1.5 list-disc list-inside font-mono">
                <li><strong className="text-slate-900 dark:text-white">Step 1:</strong> Subtract 15 from both sides &rarr; 3x = 30</li>
                <li><strong className="text-slate-900 dark:text-white">Step 2:</strong> Divide both sides by 3 &rarr; x = 10</li>
                <li><strong className="text-slate-900 dark:text-white">Key Concept:</strong> Subtraction & Division properties of equality.</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-blue-800/60">
            <p className="text-xs text-slate-500 dark:text-blue-300">
              {user ? "Your account is synced with Firebase cloud storage." : "Sign in to save your history and sync across devices."}
            </p>
            <button
              onClick={onEnterApp}
              className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <span>Try with Your Question</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Social Share Banner across top platforms */}
        <div className="mt-8 w-full max-w-xl">
          <SocialShare variant="bar" />
        </div>

        {/* Instructions & Security Badges */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-xs text-slate-500 dark:text-blue-300">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            <span>Secure Firebase Authentication</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <UserCheck className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            <span>Cloud History Sync</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Zap className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            <span>Instant Gemini AI Speed</span>
          </div>
        </div>

        {/* Buy StudyPal & QR Code Section - Last Section of Landing Page */}
        <section id="buy-section" className="mt-14 w-full max-w-4xl bg-gradient-to-br from-white via-emerald-50/40 to-slate-50 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-900 border border-emerald-300/60 dark:border-emerald-600/40 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden text-left">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Lifetime Student Access</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Unlock StudyPal Premium
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-blue-200 leading-relaxed">
                Get unlimited instant AI problem scans, detailed step-by-step reasoning, custom practice assessments, and persistent cloud sync across all your devices.
              </p>
              
              <div className="pt-2">
                <a
                  href="https://tinyurl.com/jcr8d7ak"
                  target="_blank"
                  rel="noopener noreferrer"
                  id="landing-buy-button"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base rounded-2xl shadow-xl transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
                >
                  <ShoppingCart className="w-5 h-5 text-slate-950" />
                  <span>Buy StudyPal</span>
                </a>
              </div>
            </div>

            <div className="md:col-span-5 flex flex-col items-center justify-center bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 text-center shadow-md">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1">
                Mobile Quick Checkout
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                Scan with your phone camera to purchase
              </p>
              <ScanToPayQRCode url="https://tinyurl.com/jcr8d7ak" />
            </div>
          </div>
        </section>

        {/* AdSense Unit */}
        <div className="mt-10 w-full max-w-3xl">
          <AdSenseBanner client="ca-pub-8350207430692592" slot="1234567890" format="auto" responsive={true} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-blue-900/80 py-8 px-6 text-xs text-slate-500 dark:text-blue-300 bg-slate-50/50 dark:bg-transparent">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center sm:space-x-2 text-center sm:text-left gap-1 sm:gap-2">
            <StudyPalLogo size="sm" showText={true} />
            <span className="text-slate-500 dark:text-blue-400">© 2026 AI Learning Assistant. Built with Google AI Studio & Firebase.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs">
            <button
              onClick={onOpenAbout}
              className="text-slate-600 dark:text-blue-300 hover:text-blue-950 dark:hover:text-yellow-400 transition-colors font-semibold cursor-pointer"
            >
              About Me
            </button>
            <span className="text-slate-300 dark:text-blue-700">•</span>
            <button
              onClick={onOpenContact}
              className="text-slate-600 dark:text-blue-300 hover:text-blue-950 dark:hover:text-yellow-400 transition-colors font-semibold cursor-pointer"
            >
              Contact
            </button>
            <span className="text-slate-300 dark:text-blue-700">•</span>
            <button
              onClick={() => onOpenLegal?.('terms')}
              id="footer-terms-button"
              className="text-slate-600 dark:text-blue-300 hover:text-blue-950 dark:hover:text-yellow-400 transition-colors font-semibold cursor-pointer underline underline-offset-4 decoration-slate-300 dark:decoration-blue-700 hover:decoration-blue-900 dark:hover:decoration-yellow-400"
            >
              Terms of Use
            </button>
            <span className="text-slate-300 dark:text-blue-700">•</span>
            <button
              onClick={() => onOpenLegal?.('privacy')}
              id="footer-privacy-button"
              className="text-slate-600 dark:text-blue-300 hover:text-blue-950 dark:hover:text-yellow-400 transition-colors font-semibold cursor-pointer underline underline-offset-4 decoration-slate-300 dark:decoration-blue-700 hover:decoration-blue-900 dark:hover:decoration-yellow-400"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

