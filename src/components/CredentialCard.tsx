import React from 'react';
import { Credential } from '../types';
import { StatusBadge } from './StatusBadge';
import { calculateCredentialStatus } from '../services/verificationEngine';
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
  const registryUrl = credential.metadata?.sourceRegistryUrl || 'https://direct.sos.state.tx.us/notary/search.asp';

  return (
    <div className="bubbly-card flex flex-col justify-between">
      
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#1B2A4A] leading-snug">
              {credential.title}
            </h3>
            <p className="text-xs text-[#14181F]/70 font-mono mt-0.5">
              {credential.metadata?.policyNumber
                ? `Policy #${credential.metadata.policyNumber}`
                : credential.metadata?.commissionNumber
                ? `Commission #${credential.metadata.commissionNumber}`
                : credential.fileName}
              {credential.jurisdictionCode && ` · ${credential.jurisdictionCode}`}
            </p>
          </div>
          <StatusBadge status={currentStatus} />
        </div>

        {/* Issuing Authority & Prominent 1-Click State Verification Button */}
        <div className="my-3 p-3 rounded-xl bg-[#F6F2E9] border border-[#E2DBCF] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div>
            <span className="text-[#14181F]/60 block text-[10px] uppercase font-mono">Verified Authority</span>
            <span className="font-bold text-[#14181F] flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-[#3F6B4F]" />
              {credential.metadata?.issuingAuthority || 'State SOS Office'}
            </span>
          </div>

          <a
            href={registryUrl}
            target="_blank"
            rel="noreferrer"
            className="verify-state-btn shrink-0"
            title="Verify directly on official government database"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#B8924A]" />
            Verify at State Registry
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Metadata Details */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[#14181F]/80 mb-2">
          <div>
            <span className="text-[#14181F]/50 block text-[10px] uppercase">Issued Date</span>
            <span className="font-bold">{credential.issueDate}</span>
          </div>
          <div>
            <span className="text-[#14181F]/50 block text-[10px] uppercase">Expiration Date</span>
            <span className="font-bold">
              {credential.expiryDate
                ? new Date(credential.expiryDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                : 'Perpetual'}
            </span>
          </div>
        </div>

        {/* Rejection Note if any */}
        {credential.status === 'rejected' && credential.rejectionReason && (
          <div className="mt-2 p-2.5 rounded-xl bg-[#7A3B34]/10 border border-[#7A3B34]/30 text-[#7A3B34] text-xs">
            <strong>Rejection Note:</strong> {credential.rejectionReason}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      {showActions && (
        <div className="flex items-center justify-between pt-3 border-t border-[#E2DBCF] mt-2">
          <span className="text-[11px] font-mono text-[#3F6B4F] font-bold">
            ✓ Certified by {credential.verifiedBy || 'Registrar API'}
          </span>

          <div className="flex items-center gap-2">
            {onViewDocument && (
              <button
                onClick={() => onViewDocument(credential)}
                className="px-3 py-1.5 rounded-xl bg-[#1B2A4A] hover:bg-[#121D33] text-[#F6F2E9] text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                title="Inspect Official Document PDF"
              >
                <Eye className="w-3.5 h-3.5 text-[#B8924A]" />
                Inspect Document
              </button>
            )}

            {onDelete && (
              <button
                onClick={() => onDelete(credential.id)}
                className="p-1.5 rounded-xl text-[#7A3B34] hover:bg-[#7A3B34]/10 transition-all"
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
