import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  QrCode, 
  Wifi, 
  Copy, 
  Check, 
  X, 
  ExternalLink, 
  Sparkles, 
  Download,
  Share2,
  CheckCircle2
} from 'lucide-react';
import axios from 'axios';

export default function MobileQrModal({ isOpen, onClose }) {
  const [networkData, setNetworkData] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    let isCancelled = false;
    setIsLoading(true);

    const fetchNetworkInfo = async () => {
      try {
        const response = await axios.get('/api/network-info');
        if (!isCancelled && response.data && response.data.network) {
          setNetworkData(response.data.network);
        }
      } catch (err) {
        console.warn('Network info fetch error:', err);
        if (!isCancelled) {
          const host = window.location.hostname || '192.168.1.6';
          setNetworkData({
            localIp: host,
            port: 3000,
            mobileUrl: `http://${host}:3000`
          });
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    fetchNetworkInfo();

    return () => {
      isCancelled = true;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const mobileUrl = networkData?.mobileUrl || `http://${window.location.hostname || '192.168.1.6'}:3000`;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=8&data=${encodeURIComponent(mobileUrl)}`;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(mobileUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-[350px] max-h-[92vh] overflow-y-auto glass-panel rounded-2xl border border-brand-500/40 p-4 sm:p-5 shadow-2xl text-center bg-dark-bg/95 custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-lg bg-dark-card hover:bg-dark-hover border border-dark-border text-slate-400 hover:text-white transition-colors"
          title="Close"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Title Header */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-neon flex items-center justify-center mx-auto mb-2 shadow-md shadow-brand-500/20 text-dark-bg">
          <Smartphone className="w-5 h-5 stroke-[2.5]" />
        </div>

        <h3 className="text-base font-extrabold text-white mb-0.5">
          Open on Phone
        </h3>
        <p className="text-[11px] text-slate-400 max-w-xs mx-auto mb-3">
          Scan with your phone camera to stream and download MP3s directly.
        </p>

        {/* QR Code Container */}
        <div className="relative w-44 h-44 mx-auto p-2 rounded-2xl bg-white shadow-xl border-2 border-brand-500/40 mb-3 flex items-center justify-center">
          <img
            src={qrApiUrl}
            alt="Mobile Link QR Code"
            className="w-full h-full object-contain rounded-lg"
          />
        </div>

        {/* Link Box with Copy Button */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-dark-card border border-dark-border mb-3">
          <div className="flex-1 px-2 text-left overflow-hidden">
            <div className="text-[9px] uppercase font-bold text-brand-400">Wi-Fi URL</div>
            <div className="text-[11px] font-mono font-bold text-white truncate">
              {mobileUrl}
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="px-2.5 py-1.5 rounded-lg glow-btn text-dark-bg font-extrabold text-[11px] flex items-center gap-1 shrink-0 hover:scale-105 active:scale-95 transition-all"
          >
            {isCopied ? (
              <>
                <Check className="w-3 h-3 stroke-[3]" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Instructions */}
        <div className="bg-dark-surface/70 rounded-xl p-2.5 border border-dark-border text-[11px] text-slate-300 text-left space-y-1.5 mb-3.5">
          <div className="flex items-center gap-2">
            <Wifi className="w-3.5 h-3.5 text-brand-neon shrink-0" />
            <span>Connect phone to the same Wi-Fi router.</span>
          </div>
          <div className="flex items-center gap-2">
            <QrCode className="w-3.5 h-3.5 text-brand-neon shrink-0" />
            <span>Scan QR with Camera or Google Lens.</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2 rounded-xl bg-dark-surface hover:bg-dark-hover border border-dark-border text-slate-300 hover:text-white font-bold text-xs transition-colors"
        >
          Done
        </button>

      </div>
    </div>
  );
}