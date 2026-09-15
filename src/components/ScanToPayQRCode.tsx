import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { ExternalLink, Check, Copy, QrCode } from 'lucide-react';

interface ScanToPayQRCodeProps {
  url?: string;
  className?: string;
  size?: number;
}

export default function ScanToPayQRCode({
  url = 'https://tinyurl.com/jcr8d7ak',
  className = '',
  size = 180
}: ScanToPayQRCodeProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    QRCode.toDataURL(
      url,
      {
        width: 400,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'M'
      },
      (err, dataUrl) => {
        if (!err && dataUrl) {
          setQrDataUrl(dataUrl);
        }
      }
    );
  }, [url]);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex flex-col items-center group ${className}`}>
      {/* Outer Card with exact purple aesthetic */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        title="Click or scan to pay with StudyPal"
        id="scan-to-pay-card"
        className="block bg-[#5856F6] hover:bg-[#4E4BF2] p-4 pb-3.5 rounded-[28px] shadow-2xl transition-all duration-300 hover:scale-[1.03] hover:shadow-indigo-500/25 border border-indigo-400/30 cursor-pointer text-center relative overflow-hidden"
      >
        {/* Inner White QR Box */}
        <div className="bg-white p-3 rounded-[20px] shadow-xs flex items-center justify-center relative overflow-hidden">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="Scan to pay QR code"
              className="w-40 h-40 sm:w-44 sm:h-44 object-contain rounded-lg"
            />
          ) : (
            <div className="w-40 h-40 sm:w-44 sm:h-44 bg-gray-50 flex items-center justify-center text-gray-400">
              <QrCode className="w-12 h-12 animate-pulse" />
            </div>
          )}
        </div>

        {/* Bottom Label */}
        <div className="mt-3 mb-1 flex items-center justify-center space-x-1.5 text-white">
          <span className="text-xl sm:text-2xl font-normal tracking-tight font-sans">
            Scan to pay
          </span>
        </div>
      </a>

      {/* Quick link actions */}
      <div className="mt-2.5 flex items-center space-x-3 text-xs text-blue-200">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-yellow-400 font-medium inline-flex items-center space-x-1 transition-colors"
        >
          <span>Open checkout</span>
          <ExternalLink className="w-3 h-3" />
        </a>
        <span>•</span>
        <button
          onClick={handleCopy}
          className="hover:text-yellow-400 font-medium inline-flex items-center space-x-1 transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
