import React, { useState } from 'react';
import { NotaryProfile, Credential, AccessGrant } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { calculateCredentialStatus } from '../services/verificationEngine';
import { PassportSeal } from '../components/PassportSeal';
import { ScallopedSeal } from '../components/ScallopedSeal';
import { Search, Building2, CheckCircle2, Eye, Lock, FileText } from 'lucide-react';

interface BusinessLookupViewProps {
  profile: NotaryProfile;
  credentials: Credential[];
  accessGrants: AccessGrant[];
  onViewDocument: (cred: Credential) => void;
  onRequestAccess: (companyName: string, email: string) => void;
}

export const BusinessLookupView: React.FC<BusinessLookupViewProps> = ({
  profile,
  credentials,
  accessGrants,
  onViewDocument,
  onRequestAccess,
}) => {
  const [searchHandle, setSearchHandle] = useState(profile.handle);
  const [activeTab, setActiveTab] = useState<'status_summary' | 'documents'>('status_summary');
  const [companyName, setCompanyName] = useState('First American Title');
  const [companyEmail, setCompanyEmail] = useState('vendor-onboarding@firstam.com');

  const currentGrant = accessGrants.find(
    g => g.grantedToEmail.toLowerCase() === companyEmail.toLowerCase() && g.status === 'active'
  );

  const hasFullAccess = !!currentGrant;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="bg-[#1B2A4A] text-[#F6F2E9] border-2 border-[#B8924A] p-6 sm:p-8 corner-bracket">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <PassportSeal size={68} variant="gold" className="drop-shadow-sm" />
            <div className="space-y-1">
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#B8924A]/20 text-[#B8924A] border border-[#B8924A] uppercase tracking-wider">
                VERIFYING BUSINESS PORTAL
              </span>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#F6F2E9] tracking-tight">
                Title & Signing Compliance Verification
              </h1>
              <p className="text-xs text-[#F6F2E9]/85 font-sans">
                Real-time credential status verification for work assignment.
              </p>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80 font-mono">
            <input
              type="text"
              value={searchHandle}
              onChange={(e) => setSearchHandle(e.target.value)}
              placeholder="Search Passport Handle..."
              className="w-full bg-[#14181F] border border-[#B8924A] pl-9 pr-4 py-2 text-xs text-[#F6F2E9] focus:outline-none"
            />
            <Search className="w-4 h-4 text-[#B8924A] absolute left-3 top-2.5" />
          </div>

        </div>
      </div>

      {/* Session Agency Bar */}
      <div className="p-4 bg-white border border-[#D8D2C6] border-l-4 border-l-[#1B2A4A] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#1B2A4A]/10 text-[#1B2A4A] border border-[#1B2A4A]">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[#14181F]/60 block text-[10px] uppercase">Viewing As Agency:</span>
            <div className="flex items-center gap-2 mt-0.5">
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="bg-[#F6F2E9] border border-[#D8D2C6] px-2 py-0.5 font-bold text-[#14181F] text-xs"
              />
              <input
                type="email"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                className="bg-[#F6F2E9] border border-[#D8D2C6] px-2 py-0.5 text-[#14181F]/70 text-xs"
              />
            </div>
          </div>
        </div>

        <div>
          {hasFullAccess ? (
            <span className="badge-verified">
              DOCUMENT ACCESS GRANTED
            </span>
          ) : (
            <span className="badge-expiring">
              READ-ONLY STATUS VIEW
            </span>
          )}
        </div>
      </div>

      {/* Search Result Profile Header */}
      <div className="bg-white border border-[#D8D2C6] p-6 space-y-6 rounded-3xl shadow-sm">
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 border-b border-[#D8D2C6] pb-4">
          <div className="relative shrink-0">
            <img
              src={profile.photoUrl}
              alt={profile.fullName}
              className="w-16 h-16 object-cover border-2 border-[#1B2A4A] rounded-2xl"
            />
            <ScallopedSeal size={28} showAccents={false} className="absolute -bottom-2 -right-2 drop-shadow-md" />
          </div>
          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <h2 className="font-serif font-bold text-xl text-[#14181F]">{profile.fullName}</h2>
              <span className="font-mono text-xs text-[#1B2A4A] bg-[#F6F2E9] px-2 py-0.5 border border-[#1B2A4A]/30 rounded-md">
                @{profile.handle}
              </span>
            </div>
            <p className="text-xs text-[#14181F]/80">{profile.bio}</p>
            <div className="flex items-center justify-center sm:justify-start gap-4 text-xs font-mono text-[#14181F]/70 pt-1">
              <span>Jurisdiction: <strong className="text-[#14181F]">{profile.primaryJurisdiction} ({profile.country})</strong></span>
              <span>•</span>
              <span>RON Authorized: <strong className="text-[#3F6B4F]">{profile.isRonApproved ? 'Yes' : 'No'}</strong></span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-[#D8D2C6] pb-3">
          <button
            onClick={() => setActiveTab('status_summary')}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase transition-all ${
              activeTab === 'status_summary'
                ? 'bg-[#1B2A4A] text-[#F6F2E9]'
                : 'text-[#14181F]/70 hover:text-[#14181F] hover:bg-[#F6F2E9]'
            }`}
          >
            Compliance Matrix
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 ${
              activeTab === 'documents'
                ? 'bg-[#1B2A4A] text-[#F6F2E9]'
                : 'text-[#14181F]/70 hover:text-[#14181F] hover:bg-[#F6F2E9]'
            }`}
          >
            Document Files
            {!hasFullAccess && <Lock className="w-3 h-3 text-[#B8924A]" />}
          </button>
        </div>

        {/* Tab 1: Real-Time Compliance Matrix */}
        {activeTab === 'status_summary' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {credentials.map((cred) => {
                const status = calculateCredentialStatus(cred);
                return (
                  <div key={cred.id} className="ledger-card bg-[#F6F2E9] p-4 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-serif font-bold text-[#14181F] flex items-center gap-2 text-sm">
                        <FileText className="w-4 h-4 text-[#1B2A4A]" />
                        {cred.title}
                      </div>
                      <div className="text-[11px] font-mono text-[#14181F]/70 mt-1">
                        Expires: <strong className="text-[#14181F]">{cred.expiryDate ? new Date(cred.expiryDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}</strong>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <StatusBadge status={status} />
                      {cred.metadata?.sourceRegistryUrl && (
                        <a
                          href={cred.metadata.sourceRegistryUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] font-mono text-[#1B2A4A] hover:underline font-bold flex items-center gap-1 bg-white border border-[#1B2A4A]/30 px-2 py-0.5"
                          title="Open official Secretary of State lookup page"
                        >
                          Verify at State Registry ↗
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Raw Credential Files */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            {hasFullAccess ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {credentials.map((cred) => (
                  <div key={cred.id} className="ledger-card bg-[#F6F2E9] p-4 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-serif font-bold text-[#14181F] text-sm">{cred.title}</div>
                      <div className="text-[11px] font-mono text-[#14181F]/70">{cred.fileName} ({cred.fileSize})</div>
                    </div>
                    <button
                      onClick={() => onViewDocument(cred)}
                      className="btn-primary px-3 py-1 text-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View document
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 bg-[#F6F2E9] border border-[#D8D2C6] text-center space-y-3 rounded-2xl">
                <PassportSeal size={56} variant="navy" className="mx-auto drop-shadow-sm" />
                <h3 className="font-serif font-bold text-lg text-[#14181F]">Document Access Permission Required</h3>
                <p className="text-xs text-[#14181F]/70 max-w-md mx-auto font-sans">
                  {companyName} does not currently have active document viewing permissions for {profile.fullName}.
                </p>
                <button
                  onClick={() => onRequestAccess(companyName, companyEmail)}
                  className="btn-primary"
                >
                  Request Document Access
                </button>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
