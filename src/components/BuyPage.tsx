import React from 'react';
import { 
  ShoppingCart, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  Infinity, 
  BrainCircuit, 
  Cloud, 
  ExternalLink,
  Award
} from 'lucide-react';
import ScanToPayQRCode from './ScanToPayQRCode';
import AdSenseBanner from './AdSenseBanner';

interface BuyPageProps {
  onOpenContact?: () => void;
}

export default function BuyPage({ onOpenContact }: BuyPageProps) {
  const buyUrl = "https://tinyurl.com/jcr8d7ak";

  const benefits = [
    {
      icon: Infinity,
      title: "Unlimited AI Problem Scans",
      desc: "Snap and solve as many math, science, and literature problems as you need with no daily caps."
    },
    {
      icon: BrainCircuit,
      title: "Deep Step-by-Step AI Reasoning",
      desc: "Get crystal-clear explanations, formula breakdowns, and conceptual analogies tailored to your learning style."
    },
    {
      icon: Cloud,
      title: "Cloud Sync Across All Devices",
      desc: "Access your solved problem history, notes, and progress from your phone, tablet, or desktop."
    },
    {
      icon: Award,
      title: "Personalized Practice Quizzes",
      desc: "Generate custom multiple-choice quizzes on any subject with instant explanations for every question."
    }
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Lifetime Access • No Recurring Subscriptions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Get <span className="text-emerald-600 dark:text-emerald-400">StudyPal Premium</span>
        </h1>
        <p className="text-sm text-slate-600 dark:text-blue-200 max-w-xl mx-auto">
          Upgrade to unlock unlimited learning, AI explanations, and seamless multi-device synchronization.
        </p>
      </div>

      {/* Main Buy & QR Code Checkout Card */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-blue-900/80 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Benefits & Action Button */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Full Student Suite
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Everything you need to master your courses
              </h2>
            </div>

            <div className="space-y-3.5">
              {benefits.map((b, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 mt-0.5 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">{b.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Prominent Buy StudyPal Button */}
            <div className="pt-2">
              <a
                href={buyUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="page-buy-button"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base rounded-2xl shadow-xl transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
              >
                <ShoppingCart className="w-5 h-5 text-slate-950" />
                <span>Buy StudyPal</span>
                <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
              </a>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>One-time secure purchase. Instant digital access.</span>
              </p>
            </div>
          </div>

          {/* Right Column: QR Code Mobile Checkout */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center bg-slate-50 dark:bg-blue-950/40 p-6 rounded-2xl border border-slate-200 dark:border-blue-900/50 text-center">
            <div className="mb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                Mobile Quick Checkout
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Scan with your phone camera to purchase instantly
              </p>
            </div>

            <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 inline-block">
              <ScanToPayQRCode url={buyUrl} />
            </div>

            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-3 font-medium">
              Supports Apple Pay, Google Pay, Credit/Debit cards
            </p>
          </div>
        </div>
      </div>

      {/* Trust & Support Bar */}
      <div className="bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/60 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-3 text-slate-700 dark:text-blue-200">
          <Zap className="w-5 h-5 text-yellow-500 shrink-0" />
          <span>Need help with your purchase or have questions? Reach out to the creator directly.</span>
        </div>
        {onOpenContact && (
          <button
            onClick={onOpenContact}
            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-bold rounded-xl text-xs transition-colors shrink-0 cursor-pointer"
          >
            Contact Creator
          </button>
        )}
      </div>

      {/* AdSense Unit */}
      <div className="pt-4">
        <AdSenseBanner client="ca-pub-8350207430692592" slot="1234567890" format="auto" responsive={true} />
      </div>
    </div>
  );
}
