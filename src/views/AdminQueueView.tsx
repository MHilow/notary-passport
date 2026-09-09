import React, { useState } from 'react';
import { Credential, NotaryProfile } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { PassportSeal } from '../components/PassportSeal';
import { ScallopedSeal } from '../components/ScallopedSeal';
import { CheckSquare, CheckCircle2, XCircle, Eye, FileText, User } from 'lucide-react';

interface AdminQueueViewProps {
  profile: NotaryProfile;
  credentials: Credential[];
  onVerify: (id: string, notes?: string) => void;
  onReject: (id: string, reason: string) => void;
  onViewDocument: (cred: Credential) => void;
}

export const AdminQueueView: React.FC<AdminQueueViewProps> = ({
  profile,
  credentials,
  onVerify,
  onReject,
  onViewDocument,
}) => {
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  const pendingCredentials = credentials.filter(c => c.status === 'pending');
  const reviewedCredentials = credentials.filter(c => c.status !== 'pending');

  const handleConfirmReject = (id: string) => {
    if (!rejectionReason.trim()) return;
    onReject(id, rejectionReason);
    setRejectingId(null);
    setRejectionReason('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      
      {/* Admin Queue Header Banner */}
      <div className="bg-[#1B2A4A] text-[#F6F2E9] border-2 border-[#B8924A] p-6 sm:p-8 corner-bracket">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <PassportSeal size={64} variant="gold" />
            <div className="space-y-1">
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#3F6B4F] text-[#F6F2E9] uppercase">
                REGISTRATION REVIEW QUEUE
              </span>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#F6F2E9]">
                Credential Review & Verification
              </h1>
              <p className="text-xs text-[#F6F2E9]/80 font-sans">
                Review submitted documents against state/provincial registrar records before issuing verified status marks.
              </p>
            </div>
          </div>

          <div className="text-right font-mono">
            <span className="font-serif text-3xl font-bold text-[#B8924A]">{pendingCredentials.length}</span>
            <span className="text-xs text-[#B8924A] block uppercase font-bold">Pending Reviews</span>
          </div>
        </div>
      </div>

      {/* Pending Reviews Queue */}
      <div className="space-y-4">
        <h2 className="font-serif font-bold text-lg text-[#14181F] flex items-center gap-2 border-b border-[#D8D2C6] pb-2">
          <PassportSeal size={28} variant="gold" />
          Pending Verification Requests ({pendingCredentials.length})
        </h2>

        {pendingCredentials.length === 0 ? (
          <div className="bg-white border border-[#D8D2C6] rounded-3xl p-12 text-center text-[#14181F]/60 text-xs font-mono space-y-2">
            <ScallopedSeal size={60} showAccents={false} className="mx-auto" />
            <div className="font-bold text-[#14181F] text-sm font-serif">REGISTRAR QUEUE CLEAN</div>
            <p className="mt-1 font-sans">All submitted notary credentials have been reviewed and verified.</p>
          </div>
        ) : (
          pendingCredentials.map((cred) => (
            <div key={cred.id} className="ledger-card bg-white border border-[#D8D2C6] border-l-4 border-l-[#1B2A4A] p-6 space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D8D2C6] pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#1B2A4A]/10 text-[#1B2A4A] border border-[#1B2A4A]">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#14181F]">{cred.title}</h3>
                    <div className="flex items-center gap-3 text-xs font-mono text-[#14181F]/70 mt-0.5">
                      <span className="flex items-center gap-1"><User className="w-3 h-3" /> Notary: <strong className="text-[#1B2A4A]">{profile.fullName}</strong></span>
                      <span>•</span>
                      <span>Jurisdiction: <strong className="text-[#1B2A4A]">{cred.jurisdictionCode || profile.primaryJurisdiction}</strong></span>
                    </div>
                  </div>
                </div>

                <StatusBadge status={cred.status} />
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-[#F6F2E9] border border-[#D8D2C6] text-xs font-mono text-[#14181F]">
                <div>
                  <span className="text-[#14181F]/60 block text-[10px] uppercase">File Name</span>
                  <span className="font-bold break-all block">{cred.fileName}</span>
                </div>
                <div>
                  <span className="text-[#14181F]/60 block text-[10px] uppercase">Issue Date</span>
                  <span className="font-bold">{cred.issueDate}</span>
                </div>
                <div>
                  <span className="text-[#14181F]/60 block text-[10px] uppercase">Expiry Date</span>
                  <span className="font-bold">{cred.expiryDate || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[#14181F]/60 block text-[10px] uppercase">Comm / Policy #</span>
                  <span className="font-mono text-[#1B2A4A] font-bold">{cred.metadata?.commissionNumber || cred.metadata?.policyNumber || 'N/A'}</span>
                </div>
              </div>

              {/* Reject Form Dropdown */}
              {rejectingId === cred.id ? (
                <div className="p-3 bg-[#7A3B34]/10 border-l-4 border-l-[#7A3B34] text-xs space-y-2 font-mono">
                  <label className="block text-[#7A3B34] font-bold uppercase">Rejection Reason:</label>
                  <input
                    type="text"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g. Document image unreadable or policy number mismatch"
                    className="w-full bg-white border border-[#D8D2C6] px-3 py-1.5 text-[#14181F] font-sans"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setRejectingId(null)}
                      className="btn-secondary px-3 py-1 text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleConfirmReject(cred.id)}
                      className="btn-primary px-3 py-1 text-xs bg-[#7A3B34] border-[#7A3B34]"
                    >
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              ) : (
                /* Action buttons */
                <div className="flex items-center justify-between pt-2 border-t border-[#D8D2C6]">
                  <button
                    onClick={() => onViewDocument(cred)}
                    className="btn-secondary px-3 py-1 text-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View document
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setRejectingId(cred.id)}
                      className="px-3 py-1.5 bg-[#7A3B34]/10 text-[#7A3B34] border border-[#7A3B34] text-xs font-semibold"
                    >
                      Reject
                    </button>

                    <button
                      onClick={() => onVerify(cred.id, adminNotes || 'Verified against state registry')}
                      className="btn-primary px-4 py-1.5 text-xs bg-[#3F6B4F] border-[#3F6B4F]"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve & Verify
                    </button>
                  </div>
                </div>
              )}

            </div>
          ))
        )}
      </div>

      {/* Already Reviewed Log */}
      <div className="space-y-3 pt-6 border-t border-[#D8D2C6]">
        <h3 className="font-serif font-bold text-base text-[#14181F]">Historical Verified Credentials ({reviewedCredentials.length})</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {reviewedCredentials.map((cred) => (
            <div key={cred.id} className="ledger-card bg-white p-3 flex items-center justify-between text-xs font-mono">
              <div>
                <div className="font-serif font-bold text-[#14181F] text-sm">{cred.title}</div>
                <div className="text-[11px] text-[#14181F]/60">Verified by {cred.verifiedBy || 'Registrar API'}</div>
              </div>
              <StatusBadge status={cred.status} />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
