import React from 'react';
import { Credential } from '../types';
import { StatusBadge } from './StatusBadge';
import { calculateCredentialStatus } from '../services/verificationEngine';
import { getJurisdiction } from '../data/jurisdictions';
import { PassportSeal } from './PassportSeal';
import { Eye, ExternalLink, ShieldCheck, Trash2 } from 'lucide-react';

interface CredentialCardProps {
  credential: Credential;
  onViewDocument?: (cred: Credential) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export const CredentialCard: React.FC<CredentialCardProps> = ({
  credential,
  onViewDocument,
  onDelete,
  showActions = true,
}) => {
  const currentStatus = calculateCredentialStatus(credential);
  const jurisdiction = getJurisdiction(credential.jurisdictionCode || 'TX');
  const registryUrl = credential.metadata?.sourceRegistryUrl || jurisdiction?.officialRegistryUrl || 'https://direct.sos.state.tx.us/notary/search.asp';
  const stateName = jurisdiction?.name || credential.jurisdictionCode || 'State';

  return (
    <div className="bubbly-card flex flex-col justify-between relative overflow-hidden space-y-4">
      
      {/* Top Header */}
      <div className="space-y-3">
        {/* Seal and Status Badge Bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <PassportSeal size={28} variant="navy" className="shrink-0 opacity-90" />
            {credential.jurisdictionCode && (
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1B2A4A] bg-[#F6F2E9] border border-[#1B2A4A]/20 px-2 py-0.5 rounded-md">
                {credential.jurisdictionCode} Jurisdiction
              </span>
            )}
          </div>
          <div className="shrink-0">
            <StatusBadge status={currentStatus} />
          </div>
        </div>

        {/* Title and Policy / Commission Subtitle Block */}
        <div className="space-y-1">
          <h3 className="font-serif font-bold text-base text-[#1B2A4A] leading-snug break-words">
            {credential.title}
          </h3>
          <p className="text-xs text-[#14181F]/75 font-mono leading-normal break-words">
            {credential.metadata?.policyNumber
              ? `Policy #${credential.metadata.policyNumber}`
              : credential.metadata?.commissionNumber
              ? `Commission #${credential.metadata.commissionNumber}`
              : 'Verified Official Record'}
          </p>
        </div>

        {/* Issuing Authority & Prominent 1-Click State Verification Button */}
        <div className="p-3.5 rounded-2xl bg-[#F6F2E9] border border-[#E2DBCF] space-y-2.5 text-xs">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[#14181F]/60 block text-[10px] uppercase font-mono font-bold">Verified Authority</span>
            <span className="font-bold text-[#3F6B4F] flex items-center gap-1 text-[10px] font-mono shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3F6B4F]" /> Government Server
            </span>
          </div>

          <div className="font-bold text-[#14181F] text-xs leading-normal break-words">
            {credential.metadata?.issuingAuthority || `${stateName} SOS Office`}
          </div>

          <a
            href={registryUrl}
            target="_blank"
            rel="noreferrer"
            className="verify-state-btn w-full justify-center py-2 text-xs font-bold text-center mt-1"
            title={`Verify directly on official ${stateName} government database`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#B8924A]" />
            Verify at {stateName} Registry ↗
          </a>
        </div>

        {/* Metadata Details */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[#14181F]/80 p-2.5 rounded-xl bg-[#F6F2E9]/60 border border-[#E2DBCF]/60">
          <div>
            <span className="text-[#14181F]/50 block text-[10px] uppercase font-semibold">Issued Date</span>
            <span className="font-bold">{credential.issueDate}</span>
          </div>
          <div>
            <span className="text-[#14181F]/50 block text-[10px] uppercase font-semibold">Expiration Date</span>
            <span className="font-bold">
              {credential.expiryDate
                ? new Date(credential.expiryDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                : 'Perpetual'}
            </span>
          </div>
        </div>

        {/* Rejection Note if any */}
        {credential.status === 'rejected' && credential.rejectionReason && (
          <div className="p-2.5 rounded-xl bg-[#7A3B34]/10 border border-[#7A3B34]/30 text-[#7A3B34] text-xs break-words">
            <strong>Rejection Note:</strong> {credential.rejectionReason}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      {showActions && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-3 border-t border-[#E2DBCF]">
          <span className="text-[11px] font-mono text-[#3F6B4F] font-bold leading-tight break-words min-w-0 flex-1">
            ✓ Certified by {credential.verifiedBy || 'Registrar API'}
          </span>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            {onViewDocument && (
              <button
                onClick={() => onViewDocument(credential)}
                className="px-3 py-1.5 rounded-xl bg-[#1B2A4A] hover:bg-[#121D33] text-[#F6F2E9] text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all shrink-0"
                title="Inspect Official Document PDF"
              >
                <Eye className="w-3.5 h-3.5 text-[#B8924A]" />
                Inspect Document
              </button>
            )}

            {onDelete && (
              <button
                onClick={() => onDelete(credential.id)}
                className="p-1.5 rounded-xl text-[#7A3B34] hover:bg-[#7A3B34]/10 transition-all shrink-0"
                title="Remove Record"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
