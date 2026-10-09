import React, { useState } from 'react';
import { Share2, Check, Copy, ExternalLink } from 'lucide-react';

interface SocialShareProps {
  url?: string;
  title?: string;
  summary?: string;
  className?: string;
  variant?: 'compact' | 'buttons' | 'dropdown' | 'bar';
}

interface SocialPlatform {
  name: string;
  id: 'x' | 'facebook' | 'linkedin' | 'whatsapp' | 'reddit' | 'pinterest';
  color: string;
  bgHover: string;
  textColor: string;
  iconSvg: React.ReactNode;
  getShareUrl: (url: string, title: string, summary: string) => string;
}

export default function SocialShareModalOrBar({
  url = typeof window !== 'undefined' ? window.location.href : 'https://studypal.app',
  title = 'StudyPal - Your 24/7 AI Study Coach & Homework Solver',
  summary = 'Check out StudyPal! Snap a photo of any homework problem to get step-by-step guidance, formula breakdowns, and interactive quizzes.',
  className = '',
  variant = 'bar'
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Top 6 Social Media Platforms
  const platforms: SocialPlatform[] = [
    {
      name: 'X (Twitter)',
      id: 'x',
      color: '#000000',
      bgHover: 'hover:bg-slate-900',
      textColor: 'text-white',
      iconSvg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      getShareUrl: (u, t) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(u)}`
    },
    {
      name: 'Facebook',
      id: 'facebook',
      color: '#1877F2',
      bgHover: 'hover:bg-[#166fe5]',
      textColor: 'text-white',
      iconSvg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      getShareUrl: (u) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`
    },
    {
      name: 'LinkedIn',
      id: 'linkedin',
      color: '#0A66C2',
      bgHover: 'hover:bg-[#095196]',
      textColor: 'text-white',
      iconSvg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
      getShareUrl: (u, t, s) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}&title=${encodeURIComponent(t)}&summary=${encodeURIComponent(s)}`
    },
    {
      name: 'WhatsApp',
      id: 'whatsapp',
      color: '#25D366',
      bgHover: 'hover:bg-[#20ba5a]',
      textColor: 'text-white',
      iconSvg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      ),
      getShareUrl: (u, t) => `https://api.whatsapp.com/send?text=${encodeURIComponent(`${t} - ${u}`)}`
    },
    {
      name: 'Reddit',
      id: 'reddit',
      color: '#FF4500',
      bgHover: 'hover:bg-[#e03d00]',
      textColor: 'text-white',
      iconSvg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.609a1.246 1.246 0 0 1 1.108-.695zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-4.723 4.298c-.104 0-.21.042-.29.125-.166.166-.166.437 0 .604.823.822 2.21 1.02 3.263 1.02 1.053 0 2.44-.198 3.262-1.02a.434.434 0 0 0 0-.604.434.434 0 0 0-.604 0c-.625.626-1.77.782-2.658.782s-2.033-.156-2.658-.782a.417.417 0 0 0-.315-.125z" />
        </svg>
      ),
      getShareUrl: (u, t) => `https://reddit.com/submit?url=${encodeURIComponent(u)}&title=${encodeURIComponent(t)}`
    },
    {
      name: 'Pinterest',
      id: 'pinterest',
      color: '#E60023',
      bgHover: 'hover:bg-[#cc001f]',
      textColor: 'text-white',
      iconSvg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.69 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
        </svg>
      ),
      getShareUrl: (u, t, s) => `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(u)}&description=${encodeURIComponent(`${t} - ${s}`)}`
    }
  ];

  const handleShareClick = (platform: SocialPlatform) => {
    const shareUrl = platform.getShareUrl(url, title, summary);
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=500');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  if (variant === 'bar') {
    return (
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs ${className}`}>
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          <Share2 className="w-4 h-4 text-yellow-500" />
          <span>Share StudyPal:</span>
        </div>

        <div className="flex items-center flex-wrap justify-center gap-1.5">
          {platforms.map((p) => (
            <button
              key={p.id}
              onClick={() => handleShareClick(p)}
              title={`Share on ${p.name}`}
              className="p-2 rounded-xl text-white shadow-xs transition-all hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center"
              style={{ backgroundColor: p.color }}
              aria-label={`Share on ${p.name}`}
            >
              {p.iconSvg}
            </button>
          ))}

          <button
            onClick={handleCopyLink}
            title={copied ? 'Link Copied!' : 'Copy Share Link'}
            className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs transition-all flex items-center space-x-1 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Dropdown / Popover modal format for top navigation bars
  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1.5 text-xs font-bold px-3 py-2 bg-yellow-400 hover:bg-yellow-300 text-blue-950 rounded-xl shadow-xs transition-all cursor-pointer hover:scale-105"
        title="Share StudyPal on social media"
      >
        <Share2 className="w-4 h-4" />
        <span className="hidden sm:inline">Share</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 z-50 text-slate-900 dark:text-white animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
              <div className="flex items-center space-x-2">
                <Share2 className="w-4 h-4 text-yellow-500" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-yellow-400">
                  Share StudyPal
                </h4>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Top 6 Networks</span>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              {platforms.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    handleShareClick(p);
                    setIsOpen(false);
                  }}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:scale-105 transition-all cursor-pointer group shadow-xs"
                  style={{ backgroundColor: `${p.color}15` }}
                  title={`Share on ${p.name}`}
                >
                  <div 
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-xs mb-1"
                    style={{ backgroundColor: p.color }}
                  >
                    {p.iconSvg}
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-900 dark:group-hover:text-yellow-400 truncate w-full text-center">
                    {p.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleCopyLink}
                className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Link Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span>Copy Share Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
