import React from 'react';
import { User, Share2, Building2, CheckSquare, RotateCcw } from 'lucide-react';
import { storage } from '../services/storageService';
import { PassportSeal } from './PassportSeal';

export type AppMode = 'notary_dashboard' | 'public_profile' | 'business_lookup' | 'admin_queue';

interface NavbarProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  pendingCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentMode, onModeChange, pendingCount }) => {
  return (
    <header className="bg-[#1B2A4A] text-[#F6F2E9] border-b border-[#B8924A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo with Official Passport Seal Mark (Page 5) */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onModeChange('notary_dashboard')}>
            <PassportSeal size={48} variant="gold" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-xl tracking-tight text-[#F6F2E9]">
                  Notary Passport
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#B8924A]/20 text-[#B8924A] border border-[#B8924A] uppercase tracking-wider">
                  VERIFIED
                </span>
              </div>
              <p className="text-xs text-[#F6F2E9]/70 hidden sm:block">A portable credential for notaries across the U.S. and Canada</p>
            </div>
          </div>

          {/* Navigation Buttons (Square Corners, Page 6) */}
          <nav className="flex items-center gap-1 bg-[#14181F] p-1 border border-[#B8924A]/50">
            <button
              onClick={() => onModeChange('notary_dashboard')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-none transition-all ${
                currentMode === 'notary_dashboard'
                  ? 'bg-[#B8924A] text-[#14181F]'
                  : 'text-[#F6F2E9]/80 hover:text-[#F6F2E9] hover:bg-[#1B2A4A]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Notary Vault</span>
            </button>

            <button
              onClick={() => onModeChange('public_profile')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-none transition-all ${
                currentMode === 'public_profile'
                  ? 'bg-[#B8924A] text-[#14181F]'
                  : 'text-[#F6F2E9]/80 hover:text-[#F6F2E9] hover:bg-[#1B2A4A]'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Public Profile</span>
            </button>

            <button
              onClick={() => onModeChange('business_lookup')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-none transition-all ${
                currentMode === 'business_lookup'
                  ? 'bg-[#B8924A] text-[#14181F]'
                  : 'text-[#F6F2E9]/80 hover:text-[#F6F2E9] hover:bg-[#1B2A4A]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Verifying Business</span>
            </button>

            <button
              onClick={() => onModeChange('admin_queue')}
              className={`relative flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-none transition-all ${
                currentMode === 'admin_queue'
                  ? 'bg-[#3F6B4F] text-[#F6F2E9]'
                  : 'text-[#F6F2E9]/80 hover:text-[#F6F2E9] hover:bg-[#1B2A4A]'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Registrar Queue</span>
              {pendingCount > 0 && (
                <span className="w-4 h-4 bg-[#B8924A] text-[#14181F] font-mono font-bold text-[10px] flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </button>
          </nav>

          {/* Reset Action */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (confirm('Reset state to initial verified credential records?')) {
                  storage.resetToDefault();
                  window.location.reload();
                }
              }}
              className="p-2 text-[#F6F2E9]/60 hover:text-[#F6F2E9] transition-all"
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
