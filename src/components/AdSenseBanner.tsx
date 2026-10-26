import React, { useEffect, useRef, useState } from 'react';
import { Info } from 'lucide-react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdSenseBannerProps {
  client?: string;
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
  label?: string;
}

export default function AdSenseBanner({
  client = 'ca-pub-8350207430692592',
  slot = '1234567890', // Default or user slot ID
  format = 'auto',
  responsive = true,
  className = '',
  style,
  label = 'Advertisement'
}: AdSenseBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const [adPushed, setAdPushed] = useState(false);
  const [adError, setAdError] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && adRef.current) {
        // Prevent duplicate push error in React re-renders
        if (!adRef.current.getAttribute('data-adsbygoogle-status')) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setAdPushed(true);
        }
      }
    } catch (err) {
      console.warn('AdSense notice or adblocker detected:', err);
      setAdError(true);
    }
  }, []);

  return (
    <div className={`my-4 flex flex-col items-center justify-center w-full overflow-hidden ${className}`}>
      <div className="w-full flex items-center justify-between text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest px-2 mb-1">
        <span>{label}</span>
        <span className="flex items-center space-x-1 text-[9px] text-gray-400 dark:text-slate-500 font-normal">
          <Info className="w-2.5 h-2.5" />
          <span>Google AdSense</span>
        </span>
      </div>

      <div className="w-full bg-gray-50 dark:bg-slate-900/60 border border-gray-200/80 dark:border-slate-800 rounded-2xl p-2 min-h-[90px] flex items-center justify-center relative overflow-hidden">
        {/* AdSense Unit */}
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{
            display: 'block',
            width: '100%',
            minHeight: '90px',
            textAlign: 'center',
            ...style
          }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />

        {/* Development / Container Fallback Notice when ads are loading or domain is pending AdSense approval */}
        {adError && (
          <div className="text-center p-3 text-xs text-gray-500 dark:text-slate-400 bg-gray-100/80 dark:bg-slate-800/80 rounded-xl w-full">
            <p className="font-semibold text-gray-700 dark:text-slate-200">Google AdSense Unit Ready</p>
            <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">
              Publisher Client: <code className="bg-gray-200 dark:bg-slate-700 px-1 py-0.5 rounded text-gray-800 dark:text-yellow-400 font-mono text-[10px]">{client}</code>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
