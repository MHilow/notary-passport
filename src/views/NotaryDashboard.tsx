import React, { useState } from 'react';
import { NotaryProfile, Credential, AccessGrant, VerificationLog } from '../types';
import { CredentialCard } from '../components/CredentialCard';
import { auditJurisdictionCompliance } from '../services/verificationEngine';
import { getJurisdiction } from '../data/jurisdictions';
import { PassportSeal } from '../components/PassportSeal';
import { 
  Upload, 
  Share2, 
  Key, 
  AlertTriangle, 
  CheckCircle2, 
  Building2, 
  Activity, 
  FileCheck,
  Globe,
  BookOpen
} from 'lucide-react';

interface NotaryDashboardProps {
  profile: NotaryProfile;
  credentials: Credential[];
  accessGrants: AccessGrant[];
  logs: VerificationLog[];
  onOpenUpload: () => void;
  onOpenShare: () => void;
  onOpenGrants: () => void;
  onDeleteCredential: (id: string) => void;
  onViewDocument: (cred: Credential) => void;
}

export const NotaryDashboard: React.FC<NotaryDashboardProps> = ({
  profile,
  credentials,
  accessGrants,
  logs,
  onOpenUpload,
  onOpenShare,
  onOpenGrants,
  onDeleteCredential,
  onViewDocument,
}) => {
  const [selectedJurisdictionCode, setSelectedJurisdictionCode] = useState(profile.primaryJurisdiction);
  const currentJurisdiction = getJurisdiction(selectedJurisdictionCode) || getJurisdiction('TX')!;
  const audit = auditJurisdictionCompliance(credentials, currentJurisdiction);

  const expiringCount = credentials.filter(c => c.status === 'expiring_soon').length;
  const expiredCount = credentials.filter(c => c.status === 'expired').length;
  const pendingCount = credentials.filter(c => c.status === 'pending').length;
  const verifiedCount = credentials.filter(c => c.status === 'verified').length;

  const activeGrants = accessGrants.filter(g => g.status === 'active');
  const pendingRequests = accessGrants.filter(g => g.status === 'pending_request');

  return (
    <div className="space-y-8 pb-16">
      
      {/* Passport Navy Header Banner */}
      <div className="bg-[#1B2A4A] text-[#F6F2E9] border-2 border-[#B8924A] p-6 sm:p-8 corner-bracket">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          
          {/* Notary Identity */}
          <div className="flex items-start sm:items-center gap-5">
            <PassportSeal size={72} variant="gold" />
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#F6F2E9]">
                  {profile.fullName}
                </h1>
                <span className="badge-verified">
                  PASSPORT ACTIVE
                </span>
                {profile.isRonApproved && (
                  <span className="badge-expiring">
                    RON AUTHORIZED
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[#F6F2E9]/80 max-w-xl">{profile.bio}</p>
              
              <div className="flex items-center gap-4 text-xs font-mono text-[#B8924A] pt-1">
                <span>Jurisdiction: <strong className="text-[#F6F2E9]">{profile.primaryJurisdiction} ({profile.country})</strong></span>
                <span>•</span>
                <span>Passport ID: <strong className="text-[#F6F2E9]">{profile.handle}</strong></span>
              </div>
            </div>
          </div>

          {/* Square Action Buttons (Page 6) */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              onClick={onOpenUpload}
              className="btn-primary"
            >
              <Upload className="w-4 h-4 text-[#B8924A]" />
              Upload credential
            </button>

            <button
              onClick={onOpenShare}
              className="btn-secondary"
            >
              <Share2 className="w-4 h-4" />
              Share credential
            </button>

            <button
              onClick={onOpenGrants}
              className="btn-secondary relative"
            >
              <Key className="w-4 h-4" />
              Access grants ({activeGrants.length})
              {pendingRequests.length > 0 && (
                <span className="w-4 h-4 bg-[#7A3B34] text-[#F6F2E9] font-mono text-[10px] flex items-center justify-center">
                  {pendingRequests.length}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Voice Compliant Warning Banner (Page 7) */}
      {(expiringCount > 0 || expiredCount > 0) && (
        <div className="p-4 bg-[#7A3B34]/10 border-l-4 border-l-[#7A3B34] border border-[#7A3B34]/30 text-[#14181F] flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#7A3B34] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-serif font-bold text-sm text-[#7A3B34]">Credential Expiration Notice</h4>
              <p className="text-xs text-[#14181F]/80 font-sans mt-0.5">
                Your E&O insurance expires in 23 days. Upload a renewed policy to keep this credential active.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenUpload}
            className="btn-primary px-3 py-1 text-xs shrink-0 bg-[#7A3B34] border-[#7A3B34]"
          >
            Upload renewal
          </button>
        </div>
      )}

      {/* Overview Stat Blocks */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#D8D2C6] p-4 flex items-center gap-3">
          <div className="p-2.5 bg-[#3F6B4F]/10 text-[#3F6B4F] border border-[#3F6B4F]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif font-bold text-2xl text-[#14181F]">{verifiedCount}</span>
            <span className="text-xs text-[#14181F]/60 font-mono block uppercase">Verified</span>
          </div>
        </div>

        <div className="bg-white border border-[#D8D2C6] p-4 flex items-center gap-3">
          <div className="p-2.5 bg-[#B8924A]/10 text-[#B8924A] border border-[#B8924A]">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif font-bold text-2xl text-[#14181F]">{expiringCount}</span>
            <span className="text-xs text-[#14181F]/60 font-mono block uppercase">Expiring soon</span>
          </div>
        </div>

        <div className="bg-white border border-[#D8D2C6] p-4 flex items-center gap-3">
          <div className="p-2.5 bg-[#1B2A4A]/10 text-[#1B2A4A] border border-[#1B2A4A]">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif font-bold text-2xl text-[#14181F]">{pendingCount}</span>
            <span className="text-xs text-[#14181F]/60 font-mono block uppercase">Pending review</span>
          </div>
        </div>

        <div className="bg-white border border-[#D8D2C6] p-4 flex items-center gap-3">
          <div className="p-2.5 bg-[#14181F]/10 text-[#14181F] border border-[#14181F]">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif font-bold text-2xl text-[#14181F]">{activeGrants.length}</span>
            <span className="text-xs text-[#14181F]/60 font-mono block uppercase">Access grants</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Credentials Ledger Cards */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-[#D8D2C6] pb-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#1B2A4A]" />
              <h2 className="font-serif font-bold text-xl text-[#14181F]">Credential Ledger</h2>
              <span className="font-mono text-xs text-[#14181F]/60">({credentials.length} total)</span>
            </div>
            <button
              onClick={onOpenUpload}
              className="text-xs font-semibold text-[#1B2A4A] hover:underline"
            >
              + Upload document
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {credentials.map((cred) => (
              <CredentialCard
                key={cred.id}
                credential={cred}
                onViewDocument={onViewDocument}
                onDelete={onDeleteCredential}
              />
            ))}
          </div>
        </div>

        {/* Right 1 Column: Jurisdiction Criteria & Audit Trail */}
        <div className="space-y-6">
          
          <div className="bg-white border border-[#D8D2C6] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-[#D8D2C6] pb-2">
              <h3 className="font-serif font-bold text-base text-[#14181F]">
                Jurisdiction Requirements
              </h3>
              <select
                value={selectedJurisdictionCode}
                onChange={(e) => setSelectedJurisdictionCode(e.target.value)}
                className="bg-[#F6F2E9] border border-[#D8D2C6] text-xs px-2 py-1 text-[#14181F] font-mono"
              >
                <option value="TX">Texas (US)</option>
                <option value="CA">California (US)</option>
                <option value="FL">Florida (US)</option>
                <option value="NY">New York (US)</option>
                <option value="OH">Ohio (US)</option>
                <option value="ON">Ontario (CA)</option>
                <option value="BC">British Columbia (CA)</option>
                <option value="AB">Alberta (CA)</option>
              </select>
            </div>

            <div className="p-3 bg-[#F6F2E9] border border-[#D8D2C6] text-xs mb-4">
              <div className="flex items-center justify-between font-mono font-bold text-[#14181F] mb-1">
                <span>{currentJurisdiction.name} ({currentJurisdiction.country}) Rules</span>
                <span className={audit.isFullyCompliant ? 'text-[#3F6B4F]' : 'text-[#B8924A]'}>
                  {audit.verifiedCount} / {audit.totalRequired} Met
                </span>
              </div>
              <p className="text-[11px] text-[#14181F]/70 font-sans">{currentJurisdiction.notes}</p>
            </div>

            {/* Checklist */}
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2 bg-[#F6F2E9]">
                <span>Commission Term ({currentJurisdiction.commissionTermYears} Yrs)</span>
                <CheckCircle2 className="w-4 h-4 text-[#3F6B4F]" />
              </div>

              <div className="flex items-center justify-between p-2 bg-[#F6F2E9]">
                <span>E&O Min (${(currentJurisdiction.minInsuranceAmount || 0).toLocaleString()})</span>
                {credentials.some(c => c.type === 'insurance' && c.status !== 'expired') ? (
                  <CheckCircle2 className="w-4 h-4 text-[#3F6B4F]" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-[#B8924A]" />
                )}
              </div>

              {currentJurisdiction.requiresBond && (
                <div className="flex items-center justify-between p-2 bg-[#F6F2E9]">
                  <span>State Bond (${(currentJurisdiction.bondAmountUsdOrCad || 0).toLocaleString()})</span>
                  <CheckCircle2 className="w-4 h-4 text-[#3F6B4F]" />
                </div>
              )}

              {currentJurisdiction.requiresBackgroundCheck && (
                <div className="flex items-center justify-between p-2 bg-[#F6F2E9]">
                  <span>Annual Screening</span>
                  {credentials.some(c => c.type === 'background_check' && c.status === 'verified') ? (
                    <CheckCircle2 className="w-4 h-4 text-[#3F6B4F]" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-[#7A3B34]" />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Audit Log */}
          <div className="bg-white border border-[#D8D2C6] p-5 shadow-sm">
            <h3 className="font-serif font-bold text-base text-[#14181F] mb-3 border-b border-[#D8D2C6] pb-2">
              Verification Audit Log
            </h3>

            <div className="space-y-3 max-h-56 overflow-y-auto custom-scrollbar text-xs font-mono">
              {logs.map((log) => (
                <div key={log.id} className="pb-2 border-b border-[#D8D2C6] last:border-0">
                  <div className="flex items-center justify-between text-[#14181F] font-bold">
                    <span>{log.actorName}</span>
                    <span className="text-[10px] text-[#14181F]/60">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-[11px] text-[#14181F]/70 font-sans mt-0.5">{log.notes}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
