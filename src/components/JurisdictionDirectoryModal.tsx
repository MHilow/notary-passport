import React, { useState } from 'react';
import { JURISDICTIONS } from '../data/jurisdictions';
import { X, ExternalLink, ShieldCheck, Search, Building2, CheckCircle2, Globe } from 'lucide-react';

interface JurisdictionDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const REGISTRY_URLS: Record<string, string> = {
  'TX': 'https://direct.sos.state.tx.us/notary/search.asp',
  'CA': 'https://notary.cdn.sos.ca.gov/search',
  'FL': 'https://notaries.dos.state.fl.us/notarysearch',
  'NY': 'https://dos.ny.gov/licensing-services',
  'OH': 'https://notary.ohiosos.gov/search',
  'ON': 'https://lso.ca/public-resources/finding-a-lawyer-or-paralegal',
  'BC': 'https://www.snpbc.ca/find-a-notary/',
  'AB': 'https://www.alberta.ca/notaries-public',
};

export const JurisdictionDirectoryModal: React.FC<JurisdictionDirectoryModalProps> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<'ALL' | 'US' | 'CA'>('ALL');

  if (!isOpen) return null;

  const filtered = JURISDICTIONS.filter(j => {
    const matchesCountry = selectedCountry === 'ALL' || j.country === selectedCountry;
    const matchesSearch = j.name.toLowerCase().includes(search.toLowerCase()) || 
                          j.stateOrProvince.toLowerCase().includes(search.toLowerCase());
    return matchesCountry && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#14181F]/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#FFFFFF] w-full max-w-3xl rounded-3xl border-2 border-[#B8924A] p-6 shadow-2xl space-y-5 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2DBCF]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1B2A4A] text-[#B8924A] flex items-center justify-center border border-[#B8924A]/40 shadow-md">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-xl text-[#14181F]">Official Government Verification Directory</h2>
                <span className="bubbly-pill bubbly-pill-verified">1-Click Live Lookups</span>
              </div>
              <p className="text-xs text-[#14181F]/70 mt-0.5">
                Verify notary commissions directly on official Secretary of State and Provincial Law Society servers.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#F6F2E9] hover:bg-[#E2DBCF] text-[#14181F] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#F6F2E9] p-3 rounded-2xl border border-[#E2DBCF]">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search State or Province (e.g. Texas, Ontario)..."
              className="w-full bg-[#FFFFFF] border border-[#E2DBCF] rounded-xl pl-9 pr-3 py-2 text-xs text-[#14181F] focus:outline-none focus:border-[#1B2A4A]"
            />
            <Search className="w-4 h-4 text-[#1B2A4A] absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => setSelectedCountry('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCountry === 'ALL' ? 'bg-[#1B2A4A] text-[#F6F2E9]' : 'bg-[#FFFFFF] text-[#14181F] border border-[#E2DBCF]'
              }`}
            >
              All Jurisdictions
            </button>
            <button
              onClick={() => setSelectedCountry('US')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCountry === 'US' ? 'bg-[#1B2A4A] text-[#F6F2E9]' : 'bg-[#FFFFFF] text-[#14181F] border border-[#E2DBCF]'
              }`}
            >
              🇺🇸 United States
            </button>
            <button
              onClick={() => setSelectedCountry('CA')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCountry === 'CA' ? 'bg-[#1B2A4A] text-[#F6F2E9]' : 'bg-[#FFFFFF] text-[#14181F] border border-[#E2DBCF]'
              }`}
            >
              🇨🇦 Canada
            </button>
          </div>
        </div>

        {/* Directory List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
          {filtered.map((j) => {
            const registryUrl = REGISTRY_URLS[j.stateOrProvince] || 'https://sos.state.tx.us';
            return (
              <div
                key={j.id}
                className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E2DBCF] hover:border-[#B8924A] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:shadow-md"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-base text-[#1B2A4A]">
                      {j.name} ({j.stateOrProvince})
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-[#F6F2E9] px-2 py-0.5 rounded-md border border-[#E2DBCF]">
                      {j.country === 'US' ? '🇺🇸 State SOS' : '🇨🇦 Provincial Registry'}
                    </span>
                    {j.ronAllowed && (
                      <span className="text-[10px] font-bold bg-[#3F6B4F]/10 text-[#3F6B4F] px-2 py-0.5 rounded-md border border-[#3F6B4F]/30 flex items-center gap-1">
                        <Globe className="w-3 h-3" /> RON Eligible
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#14181F]/70 max-w-xl">{j.notes}</p>
                  <div className="flex items-center gap-3 text-[11px] text-[#14181F]/60 font-mono pt-1">
                    <span>Term: <strong>{j.commissionTermYears} Years</strong></span>
                    <span>•</span>
                    <span>Bond: <strong>{j.requiresBond ? `$${j.bondAmountUsdOrCad?.toLocaleString()}` : 'None'}</strong></span>
                    <span>•</span>
                    <span>Min E&O: <strong>${(j.minInsuranceAmount || 25000).toLocaleString()}</strong></span>
                  </div>
                </div>

                <a
                  href={registryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="verify-state-btn shrink-0 justify-center"
                >
                  <ShieldCheck className="w-4 h-4 text-[#B8924A]" />
                  Verify at {j.name} Registry
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#E2DBCF] flex items-center justify-between text-xs text-[#14181F]/70">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#3F6B4F]" />
            <span>Official Government Registry Links Verified</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-2xl bg-[#1B2A4A] text-[#F6F2E9] font-bold"
          >
            Close Directory
          </button>
        </div>

      </div>
    </div>
  );
};
