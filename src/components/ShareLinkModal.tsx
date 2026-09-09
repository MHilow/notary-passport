import React, { useState } from 'react';
import { X, Copy, Check, ShieldCheck } from 'lucide-react';
import { ScallopedSeal } from './ScallopedSeal';

interface ShareLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  handle: string;
}

export const ShareLinkModal: React.FC<ShareLinkModalProps> = ({ isOpen, onClose, handle }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/n/${handle}`;

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#14181F]/70 backdrop-blur-xs">
      <div className="bg-[#1B2A4A] text-[#F6F2E9] w-full max-w-md border-2 border-[#B8924A] p-6 corner-bracket shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#B8924A]/40">
          <div className="flex items-center gap-3.5">
            <ScallopedSeal size={60} showAccents={false} />
            <div>
              <h2 className="font-serif font-black text-xl sm:text-2xl text-[#F6F2E9]">Public Verification Link</h2>
              <p className="text-xs font-mono font-bold text-[#B8924A]">Zero-Knowledge Share URL</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#F6F2E9]/60 hover:text-[#F6F2E9] rounded-xl hover:bg-[#14181F]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code Container on Paper Cream surface */}
        <div className="my-5 p-5 bg-[#F6F2E9] border-2 border-[#B8924A] text-center flex flex-col items-center shadow-inner">
          <div className="p-3.5 bg-[#F6F2E9] border-2 border-[#1B2A4A] mb-2 shadow-md">
            <svg className="w-40 h-40" viewBox="0 0 100 100" fill="none">
              <rect width="100" height="100" fill="#F6F2E9" />
              <path d="M10 10h30v30H10zM60 10h30v30H60zM10 60h30v30H10z" fill="#1B2A4A" />
              <path d="M18 18h14v14H18zM68 18h14v14H68zM18 68h14v14H18z" fill="#F6F2E9" />
              <path d="M22 22h6v6h-6zM72 22h6v6h-6zM22 72h6v6h-6z" fill="#B8924A" />
              <path d="M50 10h5v15h-5zM50 35h15v5h-15zM75 50h15v5h-15zM50 60h10v10H50zM70 70h20v20H70z" fill="#1B2A4A" />
            </svg>
          </div>
          <span className="font-serif font-black text-base text-[#14181F]">Scan Passport QR</span>
          <span className="text-xs font-mono font-bold text-[#14181F]/80">Verified Once · Trusted Everywhere</span>
        </div>

        {/* Share URL */}
        <div className="space-y-1.5 mb-4 font-mono text-xs">
          <label className="block text-[#B8924A] font-bold uppercase text-[11px]">PUBLIC VERIFICATION URL</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full bg-[#14181F] border border-[#B8924A] px-3 py-2 text-xs text-[#F6F2E9] select-all font-mono"
            />
            <button
              onClick={handleCopy}
              className={`btn-primary shrink-0 ${copied ? 'bg-[#3F6B4F] border-[#3F6B4F]' : ''}`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4 text-[#B8924A]" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Security Note */}
        <div className="p-3 bg-[#14181F] border border-[#B8924A]/40 text-[11px] text-[#F6F2E9]/80 flex items-start gap-2 font-mono">
          <ShieldCheck className="w-4 h-4 text-[#3F6B4F] shrink-0 mt-0.5" />
          <span>
            Displays verified status marks without revealing raw PDF files or personal identifiers.
          </span>
        </div>

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-[#B8924A]/40 flex justify-end font-mono">
          <button
            onClick={onClose}
            className="btn-secondary px-4 py-1.5 text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
