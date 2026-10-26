import React, { useEffect } from 'react';
import { X, Sparkles, Heart, Mail, BookOpen, MessageCircle } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenContact?: () => void;
}

export default function AboutModal({ isOpen, onClose, onOpenContact }: AboutModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-blue-900/80 rounded-3xl shadow-2xl overflow-hidden transition-all transform scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Banner */}
        <div className="h-28 bg-gradient-to-r from-blue-900 via-indigo-900 to-yellow-600/60 relative overflow-hidden flex items-center justify-between px-6">
          <div className="absolute -right-4 -bottom-6 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center space-x-2 text-yellow-300 font-bold text-xs uppercase tracking-widest z-10">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>Behind StudyPal</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer z-10"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Creator Avatar & Header Card */}
        <div className="px-6 sm:px-8 pt-0 pb-6 relative">
          <div className="-mt-12 mb-4 flex items-end justify-between">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 p-1 shadow-xl border-4 border-white dark:border-slate-900 flex items-center justify-center text-blue-950">
              <div className="w-full h-full rounded-xl bg-blue-950 dark:bg-slate-900 flex items-center justify-center">
                <span className="text-3xl font-black text-yellow-400">SP</span>
              </div>
            </div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-400/15 text-yellow-800 dark:text-yellow-300 border border-yellow-500/30">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>Built for Students</span>
            </div>
          </div>

          <div className="mb-4">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              About the Creator
            </h2>
            <p className="text-xs font-semibold text-slate-500 dark:text-blue-300 mt-0.5">
              Creator & Developer of StudyPal
            </p>
          </div>

          {/* Exact Creator Message */}
          <div className="p-5 bg-slate-50 dark:bg-blue-950/60 rounded-2xl border border-slate-200/80 dark:border-blue-900/50 shadow-inner">
            <p className="text-sm leading-relaxed text-slate-700 dark:text-blue-100 font-normal">
              Hi, I’m the creator of StudyPal. I built this app because I know how overwhelming studying can feel when you’re juggling deadlines, notes, and everything else life throws at you. I wanted a tool that makes learning simpler, more organized, and a little more enjoyable. StudyPal is designed to help you stay on track, break big goals into manageable steps, and build habits that actually stick. Every feature comes from real student struggles, and I’m constantly improving it based on feedback from people like you. Thanks for being part of the journey. I hope StudyPal helps you study smarter and feel more confident along the way.
            </p>
          </div>

          {/* Key Mission Pills */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300">
              <BookOpen className="w-4 h-4 text-yellow-500 shrink-0" />
              <span className="font-medium text-[11px]">Smarter, Simpler Learning</span>
            </div>
            <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300">
              <MessageCircle className="w-4 h-4 text-blue-500 shrink-0" />
              <span className="font-medium text-[11px]">Built on Student Feedback</span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            {onOpenContact && (
              <button
                onClick={() => {
                  onClose();
                  onOpenContact();
                }}
                className="inline-flex items-center space-x-2 px-4 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Contact the Creator</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer ml-auto"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
