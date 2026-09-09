import React from 'react';
import { Credential } from '../types';
import { StatusBadge } from './StatusBadge';
import { calculateCredentialStatus } from '../services/verificationEngine';
import { Eye, Trash2 } from 'lucide-react';

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

  return (
    <div className="ledger-card bg-white border border-[#D8D2C6] border-l-4 border-l-[#1B2A4A] p-5 relative font-sans">
      
      {/* Top Header: Title & Expiry */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-serif font-bold text-lg text-[#14181F] leading-tight">
            {credential.title}
          </h3>
          <p className="text-xs text-[#14181F]/70 mt-1">
            {credential.metadata?.policyNumber ? `Policy #${credential.metadata.policyNumber}` : credential.metadata?.commissionNumber ? `Commission #${credential.metadata.commissionNumber}` : credential.fileName}
            {credential.jurisdictionCode && ` · ${credential.jurisdictionCode}`}
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[11px] text-[#14181F]/60 block">Expires</span>
          <span className="font-bold text-sm text-[#14181F]">
            {credential.expiryDate
              ? new Date(credential.expiryDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
              : 'N/A'}
          </span>
        </div>
      </div>

      {/* Rejection Note if any */}
      {credential.status === 'rejected' && credential.rejectionReason && (
        <div className="mt-3 p-2 bg-[#7A3B34]/10 border-l-2 border-l-[#7A3B34] text-[#7A3B34] text-xs">
          <strong>Rejection Note:</strong> {credential.rejectionReason}
        </div>
      )}

      {/* Bottom Row: Status Badge & Actions */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#D8D2C6]">
        <StatusBadge status={currentStatus} />

        {showActions && (
          <div className="flex items-center gap-2">
            {onViewDocument && (
              <button
                onClick={() => onViewDocument(credential)}
                className="btn-secondary px-3 py-1 text-xs"
                title="Inspect Official Document"
              >
                <Eye className="w-3.5 h-3.5" />
                View document
              </button>
            )}

            {onDelete && (
              <button
                onClick={() => onDelete(credential.id)}
                className="p-1 text-[#7A3B34] hover:bg-[#7A3B34]/10 transition-all"
                title="Remove Record"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
