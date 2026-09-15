import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileText, 
  ShieldCheck, 
  Search, 
  Check, 
  Copy, 
  Printer, 
  ArrowUpRight, 
  Scale, 
  Lock,
  BookOpen
} from 'lucide-react';
import { TERMS_OF_USE_SECTIONS, PRIVACY_POLICY_SECTIONS, LegalSection } from '../data/legalContent';

export type LegalTab = 'terms' | 'privacy';

interface LegalModalProps {
  isOpen: boolean;
  initialTab?: LegalTab;
  onClose: () => void;
}

export default function LegalModal({
  isOpen,
  initialTab = 'terms',
  onClose
}: LegalModalProps) {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setActiveTab(initialTab);
    setSearchQuery('');
  }, [initialTab, isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentSections = activeTab === 'terms' ? TERMS_OF_USE_SECTIONS : PRIVACY_POLICY_SECTIONS;
  const docTitle = activeTab === 'terms' ? 'Terms of Use' : 'Privacy Policy';

  const filteredSections = searchQuery.trim() === ''
    ? currentSections
    : currentSections.filter(section => {
        const query = searchQuery.toLowerCase();
        return (
          section.title.toLowerCase().includes(query) ||
          section.content.some(paragraph => paragraph.toLowerCase().includes(query))
        );
      });

  const handleCopyAll = () => {
    const text = currentSections.map(s => `${s.title}\n\n${s.content.join('\n\n')}`).join('\n\n---\n\n');
    navigator.clipboard.writeText(`${docTitle} - StudyPal\nLast Updated: September 2026\n\n${text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-slate-900 dark:bg-slate-950 text-white px-6 py-5 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-400 text-slate-950 flex items-center justify-center shadow-xs">
              {activeTab === 'terms' ? <Scale className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 id="legal-modal-title" className="text-xl font-bold tracking-tight text-white">
                  StudyPal Legal Center
                </h2>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-yellow-400/20 text-yellow-300 rounded-md border border-yellow-400/30">
                  Official
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Effective & Last Updated: September 2026
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab & Controls Bar */}
        <div className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
          {/* Document Tabs */}
          <div className="flex items-center space-x-2 bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => { setActiveTab('terms'); setSearchQuery(''); }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center space-x-2 cursor-pointer ${
                activeTab === 'terms'
                  ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-yellow-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-blue-900 dark:text-yellow-400" />
              <span>Terms of Use</span>
            </button>
            <button
              onClick={() => { setActiveTab('privacy'); setSearchQuery(''); }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center space-x-2 cursor-pointer ${
                activeTab === 'privacy'
                  ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Privacy Policy</span>
            </button>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search topics (e.g. AI, cookies)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-blue-900 dark:focus:border-yellow-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <button
              onClick={handleCopyAll}
              title="Copy document text"
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={handlePrint}
              title="Print document"
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hidden sm:flex"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 sm:p-8 flex-1 text-slate-800 dark:text-slate-200 space-y-8 print:p-0">
          {/* Document Title Header */}
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
            <div className="flex items-center space-x-2 text-xs font-semibold text-blue-900 dark:text-yellow-400 mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>StudyPal Learning Platform</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight">
              {docTitle}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Please read these terms carefully before utilizing StudyPal services, OCR scanning, or AI study tools.
            </p>
          </div>

          {/* Quick-Jump Section Navigator */}
          {!searchQuery && (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800">
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Quick Navigation
              </p>
              <div className="flex flex-wrap gap-2">
                {currentSections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="text-xs font-medium px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-blue-950 dark:hover:text-yellow-400 border border-slate-200 dark:border-slate-700 rounded-md transition-colors"
                  >
                    {section.title.split('.')[1]?.trim() || section.title}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Filtered Sections */}
          {filteredSections.length === 0 ? (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              <p className="text-sm font-medium">No policy sections matched "{searchQuery}".</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-xs font-bold text-blue-900 dark:text-yellow-400 hover:underline cursor-pointer"
              >
                Clear search filter
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredSections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-4">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center">
                    <span className="text-yellow-600 dark:text-yellow-400 mr-2 font-mono text-sm">§</span>
                    <span>{section.title}</span>
                  </h3>
                  <div className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-4 border-l-2 border-slate-100 dark:border-slate-800">
                    {section.content.map((paragraph, idx) => (
                      <p 
                        key={idx} 
                        className={paragraph.startsWith('•') ? 'font-medium text-slate-700 dark:text-slate-200 pl-2' : ''}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}

          {/* Legal Signoff footer */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>© 2026 StudyPal. All rights reserved. Powered by Google AI Studio & Firebase.</p>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setActiveTab(activeTab === 'terms' ? 'privacy' : 'terms')}
                className="text-blue-900 dark:text-yellow-400 font-bold hover:underline cursor-pointer flex items-center space-x-1"
              >
                <span>Switch to {activeTab === 'terms' ? 'Privacy Policy' : 'Terms of Use'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="bg-slate-50 dark:bg-slate-850 px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Have questions? Email <span className="font-semibold text-slate-800 dark:text-slate-200">support@studypal.app</span>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-950 dark:bg-indigo-600 hover:bg-blue-900 dark:hover:bg-indigo-500 text-yellow-400 dark:text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
