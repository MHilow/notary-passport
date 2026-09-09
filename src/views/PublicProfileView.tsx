import React, { useState } from 'react';
import { NotaryProfile, Credential, AccessGrant } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { calculateCredentialStatus } from '../services/verificationEngine';
import { PassportSeal } from '../components/PassportSeal';
import { ScallopedSeal } from '../components/ScallopedSeal';
import { ShieldCheck, Lock, Building2, CheckCircle2, FileText, ArrowRight, BookOpen } from 'lucide-react';

interface PublicProfileViewProps {
  profile: NotaryProfile;
  credentials: Credential[];
  accessGrants: AccessGrant[];
  onRequestAccess: (companyName: string, email: string) => void;
}

export const PublicProfileView: React.FC<PublicProfileViewProps> = ({
  profile,
  credentials,
  accessGrants,
  onRequestAccess,
}) => {
  const [requestCompanyName, setRequestCompanyName] = useState('');
  const [requestEmail, setRequestEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const verifiedCount = credentials.filter(c => calculateCredentialStatus(c) === 'verified').length;
  const totalCount = credentials.length;

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestCompanyName || !requestEmail) return;
    onRequestAccess(requestCompanyName, requestEmail);
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Zero Knowledge Public Notice Banner */}
      <div className="p-3 bg-[#3F6B4F]/10 border-l-4 border-l-[#3F6B4F] border border-[#3F6B4F]/30 text-[#14181F] text-xs font-mono flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#3F6B4F] shrink-0" />
          <span>
            <strong>Zero-Knowledge Public Verification Profile:</strong> Credential validity and expiration dates are confirmed real-time.
          </span>
        </div>
        <span className="font-bold text-[11px] text-[#1B2A4A] bg-[#FFFFFF] px-2 py-0.5 border border-[#D8D2C6] shrink-0">
          ID: {profile.handle}
        </span>
      </div>

      {/* Main Passport Header Card */}
      <div className="bg-[#1B2A4A] text-[#F6F2E9] border-2 border-[#B8924A] p-6 sm:p-8 corner-bracket space-y-6">
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-[#B8924A]/40 pb-6">
          <ScallopedSeal size={104} />
          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap">
              <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#F6F2E9]">{profile.fullName}</h1>
              <span className="badge-verified">
                VERIFIED PROFILE
              </span>
            </div>
            <p className="text-xs text-[#F6F2E9]/80 max-w-xl">{profile.bio}</p>
            
            <div className="flex items-center justify-center sm:justify-start gap-4 text-xs font-mono text-[#B8924A] pt-2">
              <span>Jurisdiction: <strong className="text-[#F6F2E9]">{profile.primaryJurisdiction} ({profile.country})</strong></span>
              <span>•</span>
              <span>RON Authorized: <strong className="text-[#F6F2E9]">{profile.isRonApproved ? 'Yes' : 'No'}</strong></span>
            </div>
          </div>
        </div>

        {/* Credentials Verification Summary Ledger */}
        <div>
          <div className="flex items-center justify-between mb-4 border-b border-[#B8924A]/30 pb-2">
            <h2 className="font-serif font-bold text-lg text-[#F6F2E9] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#B8924A]" />
              Credential Verification Status ({verifiedCount}/{totalCount} Valid)
            </h2>
            <span className="text-xs font-mono text-[#B8924A]">State & Provincial Registry Verified</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {credentials.map((cred) => {
              const status = calculateCredentialStatus(cred);
              return (
                <div key={cred.id} className="ledger-card bg-white p-4 flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <div className="font-serif font-bold text-[#14181F] text-sm flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#1B2A4A]" />
                      {cred.title}
                    </div>
                    <div className="text-[11px] font-mono text-[#14181F]/70">
                      <span>Expires: <strong className="text-[#14181F]">{cred.expiryDate ? new Date(cred.expiryDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}</strong></span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <StatusBadge status={status} />
                    {cred.metadata?.sourceRegistryUrl && (
                      <a
                        href={cred.metadata.sourceRegistryUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-mono text-[#1B2A4A] hover:underline font-bold flex items-center gap-1 bg-[#F6F2E9] border border-[#1B2A4A]/30 px-2 py-0.5"
                        title="Verify record directly on official government website"
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
      </div>

      {/* Business Access Request Form */}
      <div className="bg-white border border-[#D8D2C6] p-6 shadow-sm">
        <div className="flex items-start gap-4 mb-4 border-b border-[#D8D2C6] pb-4">
          <div className="p-3 bg-[#1B2A4A]/10 text-[#1B2A4A] border border-[#1B2A4A]">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-[#14181F]">Request Document Viewing Permission</h3>
            <p className="text-xs text-[#14181F]/70 font-sans mt-0.5">
              Signing platforms and title companies requiring raw document access for job assignment can submit a permission request.
            </p>
          </div>
        </div>

        {isSubmitted ? (
          <div className="p-4 bg-[#3F6B4F]/10 border-l-4 border-l-[#3F6B4F] text-[#14181F] text-xs font-mono text-center space-y-1">
            <CheckCircle2 className="w-6 h-6 text-[#3F6B4F] mx-auto" />
            <div className="font-bold text-sm">Access request submitted.</div>
            <p className="text-[#14181F]/80 font-sans">
              Request logged for <strong className="text-[#1B2A4A]">{requestEmail}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitRequest} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-[#14181F] font-mono font-semibold mb-1 uppercase text-[11px]">Organization Name</label>
              <input
                type="text"
                value={requestCompanyName}
                onChange={(e) => setRequestCompanyName(e.target.value)}
                placeholder="e.g. First American Title"
                className="w-full bg-[#F6F2E9] border border-[#D8D2C6] px-3 py-2 text-[#14181F] font-sans"
                required
              />
            </div>
            <div>
              <label className="block text-[#14181F] font-mono font-semibold mb-1 uppercase text-[11px]">Company Email</label>
              <input
                type="email"
                value={requestEmail}
                onChange={(e) => setRequestEmail(e.target.value)}
                placeholder="e.g. compliance@firstam.com"
                className="w-full bg-[#F6F2E9] border border-[#D8D2C6] px-3 py-2 text-[#14181F] font-sans"
                required
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="btn-primary w-full justify-center"
              >
                <Lock className="w-3.5 h-3.5" />
                Request Document Access
              </button>
            </div>
          </form>
        )}
      </div>

    </div>
  );
};
