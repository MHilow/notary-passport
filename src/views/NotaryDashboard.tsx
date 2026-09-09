import React, { useState } from 'react';
import { NotaryProfile, Credential, AccessGrant, VerificationLog } from '../types';
import { CredentialCard } from '../components/CredentialCard';
import { auditJurisdictionCompliance } from '../services/verificationEngine';
import { getJurisdiction } from '../data/jurisdictions';
import { PassportSeal } from '../components/PassportSeal';
import { ScallopedSeal } from '../components/ScallopedSeal';
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
  BookOpen,
  Building,
  ExternalLink
} from 'lucide-react';

interface NotaryDashboardProps {
  profile: NotaryProfile;
  credentials: Credential[];
  accessGrants: AccessGrant[];
  logs: VerificationLog[];
  onOpenUpload: () => void;
  onOpenShare: () => void;
  onOpenGrants: () => void;
  onOpenDirectory: () => void;
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
  onOpenDirectory,
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
      
      {/* Welcoming Official Passport Hero Panel */}
      <div className="official-hero-panel p-6 sm:p-7">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <ScallopedSeal size={96} className="drop-shadow-lg shrink-0" />
            <div className="space-y-1.5">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#F6F2E9] tracking-tight">
                  Welcome back, {profile.fullName.split(' ')[0]}
                </h1>
                <span className="bubbly-pill bubbly-pill-verified text-xs px-2.5 py-0.5 font-bold shadow-xs">
                  Passport Active
                </span>
                {profile.isRonApproved && (
                  <span className="bubbly-pill bubbly-pill-gold text-xs px-2.5 py-0.5 font-bold shadow-xs">
                    <Globe className="w-3.5 h-3.5" /> RON Authorized
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[#F6F2E9]/85 font-sans max-w-xl leading-relaxed">{profile.bio}</p>
              
              <div className="flex items-center gap-4 text-xs font-mono text-[#B8924A] pt-0.5">
                <span>Primary State: <strong className="text-[#F6F2E9]">{profile.primaryJurisdiction} ({profile.country})</strong></span>
                <span>•</span>
                <span>Passport Handle: <strong className="text-[#F6F2E9]">@{profile.handle}</strong></span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              onClick={onOpenUpload}
              className="px-4 py-2.5 rounded-2xl bg-[#B8924A] hover:bg-[#d4af65] text-[#14181F] font-bold text-xs sm:text-sm flex items-center gap-2 border border-[#F6F2E9]/40 shadow-md transition-all transform hover:-translate-y-0.5"
            >
              <Upload className="w-4 h-4" />
              Upload Credential
            </button>

            <button
              onClick={onOpenShare}
              className="px-4 py-2.5 rounded-2xl bg-[#14181F] hover:bg-[#0C1424] text-[#F6F2E9] font-bold text-xs sm:text-sm flex items-center gap-2 border border-[#B8924A]/60 shadow-sm transition-all"
            >
              <Share2 className="w-4 h-4 text-[#B8924A]" />
              Share Link & QR
            </button>

            <button
              onClick={onOpenGrants}
              className="relative px-4 py-2.5 rounded-2xl bg-[#14181F] hover:bg-[#0C1424] text-[#F6F2E9] font-bold text-xs sm:text-sm flex items-center gap-2 border border-[#B8924A]/60 shadow-sm transition-all"
            >
              <Key className="w-4 h-4 text-[#B8924A]" />
              Access Grants ({activeGrants.length})
              {pendingRequests.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#7A3B34] text-[#F6F2E9] font-mono font-bold text-[10px] flex items-center justify-center border border-[#B8924A] shadow-xs">
                  {pendingRequests.length}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Prominent State Registry Direct Verification Callout Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border-2 border-[#B8924A] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <PassportSeal size={40} variant="gold" className="shrink-0 drop-shadow-sm" />
          <div>
            <h4 className="font-serif font-bold text-sm text-[#1B2A4A] flex items-center gap-2">
              Official State & Provincial Verification Registries
            </h4>
            <p className="text-xs text-[#14181F]/70 font-sans mt-0.5">
              Title companies and clients can independently verify your notary commission directly on state government servers in 1 click.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenDirectory}
          className="verify-state-btn px-4 py-2 text-xs shrink-0 justify-center"
        >
          <Building className="w-4 h-4 text-[#B8924A]" />
          Browse State Directory 🏛️
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Renewal Alert Notice */}
      {(expiringCount > 0 || expiredCount > 0) && (
        <div className="p-4 rounded-2xl bg-[#7A3B34]/10 border-l-4 border-l-[#7A3B34] border border-[#7A3B34]/30 text-[#14181F] flex items-start justify-between gap-4">
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
            className="px-4 py-2 rounded-2xl bg-[#7A3B34] hover:bg-[#7A3B34]/90 text-[#F6F2E9] font-bold text-xs shrink-0 shadow-md"
          >
            Upload Renewal
          </button>
        </div>
      )}

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E2DBCF] rounded-2xl p-4 flex items-center gap-3 shadow-sm">
          <div className="p-3 rounded-2xl bg-[#3F6B4F]/10 text-[#3F6B4F] border border-[#3F6B4F]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif font-bold text-2xl text-[#14181F]">{verifiedCount}</span>
            <span className="text-xs text-[#14181F]/60 font-mono block uppercase">Verified Credentials</span>
          </div>
        </div>

        <div className="bg-white border border-[#E2DBCF] rounded-2xl p-4 flex items-center gap-3 shadow-sm">
          <div className="p-3 rounded-2xl bg-[#B8924A]/10 text-[#B8924A] border border-[#B8924A]">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif font-bold text-2xl text-[#14181F]">{expiringCount}</span>
            <span className="text-xs text-[#14181F]/60 font-mono block uppercase">Expiring Soon</span>
          </div>
        </div>

        <div className="bg-white border border-[#E2DBCF] rounded-2xl p-4 flex items-center gap-3 shadow-sm">
          <div className="p-3 rounded-2xl bg-[#1B2A4A]/10 text-[#1B2A4A] border border-[#1B2A4A]">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif font-bold text-2xl text-[#14181F]">{pendingCount}</span>
            <span className="text-xs text-[#14181F]/60 font-mono block uppercase">Pending Review</span>
          </div>
        </div>

        <div className="bg-white border border-[#E2DBCF] rounded-2xl p-4 flex items-center gap-3 shadow-sm">
          <div className="p-3 rounded-2xl bg-[#14181F]/10 text-[#14181F] border border-[#14181F]">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif font-bold text-2xl text-[#14181F]">{activeGrants.length}</span>
            <span className="text-xs text-[#14181F]/60 font-mono block uppercase">Active Grants</span>
          </div>
        </div>
      </div>

      {/* Main Vault Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Credentials Cards */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-[#E2DBCF] pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#1B2A4A]" />
              <h2 className="font-serif font-bold text-xl text-[#14181F]">Credential Vault</h2>
              <span className="font-mono text-xs text-[#14181F]/60">({credentials.length} Recorded)</span>
            </div>
            <button
              onClick={onOpenUpload}
              className="text-xs font-bold text-[#1B2A4A] hover:underline"
            >
              + Add New Document
            </button>
          </div>

          {credentials.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-[#E2DBCF] rounded-3xl p-10 text-center space-y-3">
              <ScallopedSeal size={64} showAccents={false} className="mx-auto" />
              <h3 className="font-serif font-bold text-lg text-[#14181F]">No Credential Documents Uploaded</h3>
              <p className="text-xs text-[#14181F]/70 font-sans max-w-sm mx-auto">
                Upload your notary commission, E&O policy, background check, or state bond to activate zero-knowledge verification.
              </p>
              <button
                onClick={onOpenUpload}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Upload className="w-4 h-4 text-[#B8924A]" />
                Upload First Credential
              </button>
            </div>
          ) : (
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
          )}
        </div>

        {/* Right 1 Column: Jurisdiction Rules Compliance Engine */}
        <div className="space-y-6">
          
          <div className="bg-white border-2 border-[#B8924A] rounded-3xl p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2DBCF] pb-3">
              <h3 className="font-serif font-bold text-base text-[#14181F] flex items-center gap-2">
                <PassportSeal size={28} variant="navy" />
                Jurisdiction Compliance Engine
              </h3>
              <select
                value={selectedJurisdictionCode}
                onChange={(e) => setSelectedJurisdictionCode(e.target.value)}
                className="bg-[#F6F2E9] border border-[#E2DBCF] rounded-xl text-xs px-2.5 py-1 text-[#14181F] font-mono"
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

            <div className="p-3 bg-[#F6F2E9] rounded-2xl border border-[#E2DBCF] text-xs">
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
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F6F2E9]">
                <span>Commission Term ({currentJurisdiction.commissionTermYears} Yrs)</span>
                <CheckCircle2 className="w-4 h-4 text-[#3F6B4F]" />
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F6F2E9]">
                <span>E&O Min (${(currentJurisdiction.minInsuranceAmount || 0).toLocaleString()})</span>
                {credentials.some(c => c.type === 'insurance' && c.status !== 'expired') ? (
                  <CheckCircle2 className="w-4 h-4 text-[#3F6B4F]" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-[#B8924A]" />
                )}
              </div>

              {currentJurisdiction.requiresBond && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F6F2E9]">
                  <span>State Bond (${(currentJurisdiction.bondAmountUsdOrCad || 0).toLocaleString()})</span>
                  <CheckCircle2 className="w-4 h-4 text-[#3F6B4F]" />
                </div>
              )}

              {currentJurisdiction.requiresBackgroundCheck && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F6F2E9]">
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
          <div className="bg-white border border-[#E2DBCF] rounded-3xl p-6 shadow-sm">
            <h3 className="font-serif font-bold text-base text-[#14181F] mb-3 border-b border-[#E2DBCF] pb-2 flex items-center gap-2">
              <PassportSeal size={24} variant="gold" />
              Verification Audit Trail
            </h3>

            <div className="space-y-3 max-h-56 overflow-y-auto custom-scrollbar text-xs font-mono">
              {logs.map((log) => (
                <div key={log.id} className="pb-2 border-b border-[#E2DBCF] last:border-0">
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
