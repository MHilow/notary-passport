import React from 'react';
import { User, Share2, Building2, CheckSquare, RotateCcw, Building } from 'lucide-react';
import { storage } from '../services/storageService';
import { ScallopedSeal } from './ScallopedSeal';

export type AppMode = 'notary_dashboard' | 'public_profile' | 'business_lookup' | 'admin_queue';

interface NavbarProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  pendingCount: number;
  onOpenDirectory: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentMode, onModeChange, pendingCount, onOpenDirectory }) => {
  return (
    <header className="bg-[#1B2A4A] text-[#F6F2E9] border-b-2 border-[#B8924A] shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24 sm:h-28">
          
          {/* Logo with Prominent Scalloped Seal (Size 80px) */}
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => onModeChange('notary_dashboard')}>
            <ScallopedSeal size={80} className="transform group-hover:scale-105 transition-transform drop-shadow-md" />
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-serif font-black text-2xl sm:text-3xl tracking-tight text-[#F6F2E9]">
                  Notary Passport
                </span>
                <span className="bubbly-pill bubbly-pill-verified py-1 px-2.5 text-xs font-black shadow-sm">
                  Official Wallet
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#F6F2E9]/90 font-medium font-sans hidden sm:block mt-0.5">
                Verified once, trusted everywhere
              </p>
            </div>
          </div>

          {/* Navigation & Directory Actions */}
          <div className="flex items-center gap-3">
            
            {/* Prominent State Verification Directory Button */}
            <button
              onClick={onOpenDirectory}
              className="verify-state-btn px-4 py-2.5 text-xs sm:text-sm font-black shadow-md"
              title="Open Official State & Provincial Verification Directory"
            >
              <Building className="w-4 h-4 text-[#B8924A]" />
              State Registries 🏛️
            </button>

            {/* View Switcher Tabs */}
            <nav className="flex items-center gap-1 bg-[#14181F] p-1.5 rounded-2xl border border-[#B8924A]/40 shadow-inner">
              <button
                onClick={() => onModeChange('notary_dashboard')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                  currentMode === 'notary_dashboard'
                    ? 'bg-[#B8924A] text-[#14181F] font-black shadow-md'
                    : 'text-[#F6F2E9]/80 hover:text-[#F6F2E9] hover:bg-[#1B2A4A]'
                }`}
              >
                <User className="w-4 h-4" />
                <span className="hidden lg:inline">Notary Vault</span>
              </button>

              <button
                onClick={() => onModeChange('public_profile')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                  currentMode === 'public_profile'
                    ? 'bg-[#B8924A] text-[#14181F] font-black shadow-md'
                    : 'text-[#F6F2E9]/80 hover:text-[#F6F2E9] hover:bg-[#1B2A4A]'
                }`}
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden lg:inline">Public Profile</span>
              </button>

              <button
                onClick={() => onModeChange('business_lookup')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                  currentMode === 'business_lookup'
                    ? 'bg-[#B8924A] text-[#14181F] font-black shadow-md'
                    : 'text-[#F6F2E9]/80 hover:text-[#F6F2E9] hover:bg-[#1B2A4A]'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span className="hidden lg:inline">Agency Portal</span>
              </button>

              <button
                onClick={() => onModeChange('admin_queue')}
                className={`relative flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                  currentMode === 'admin_queue'
                    ? 'bg-[#3F6B4F] text-[#F6F2E9] font-black shadow-md'
                    : 'text-[#F6F2E9]/80 hover:text-[#F6F2E9] hover:bg-[#1B2A4A]'
                }`}
              >
                <CheckSquare className="w-4 h-4" />
                <span className="hidden lg:inline">Registrar Queue</span>
                {pendingCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#B8924A] text-[#14181F] font-mono font-bold text-[10px] flex items-center justify-center">
                    {pendingCount}
                  </span>
                )}
              </button>
            </nav>

            {/* Reset Action */}
            <button
              onClick={() => {
                if (confirm('Reset state to initial verified credential records?')) {
                  storage.resetToDefault();
                  window.location.reload();
                }
              }}
              className="p-2 text-[#F6F2E9]/60 hover:text-[#F6F2E9] rounded-xl hover:bg-[#14181F] transition-all"
              title="Reset Demo State"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
