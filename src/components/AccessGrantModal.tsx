import React, { useState } from 'react';
import { AccessGrant } from '../types';
import { X, Key, Plus, Trash2, Building2 } from 'lucide-react';
import { PassportSeal } from './PassportSeal';

interface AccessGrantModalProps {
  isOpen: boolean;
  onClose: () => void;
  grants: AccessGrant[];
  onGrantAccess: (name: string, email: string) => void;
  onRevokeAccess: (id: string) => void;
  onApproveRequest?: (id: string) => void;
}

export const AccessGrantModal: React.FC<AccessGrantModalProps> = ({
  isOpen,
  onClose,
  grants,
  onGrantAccess,
  onRevokeAccess,
  onApproveRequest,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    onGrantAccess(name, email);
    setName('');
    setEmail('');
    setIsFormOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#14181F]/70 backdrop-blur-xs">
      <div className="bg-[#1B2A4A] text-[#F6F2E9] w-full max-w-xl border-2 border-[#B8924A] p-6 corner-bracket shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#B8924A]/40">
          <div className="flex items-center gap-3.5">
            <PassportSeal size={60} variant="gold" className="drop-shadow-md" />
            <div>
              <h2 className="font-serif font-black text-xl sm:text-2xl text-[#F6F2E9]">Document Access Grants</h2>
              <p className="text-xs font-mono font-bold text-[#B8924A]">Authorized Agencies & Platforms</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#F6F2E9]/60 hover:text-[#F6F2E9] rounded-xl hover:bg-[#14181F]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="my-4 flex items-center justify-between font-mono text-xs">
          <span className="font-bold text-[#F6F2E9]">
            ACTIVE PERMISSIONS ({grants.filter(g => g.status === 'active').length})
          </span>
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="btn-primary px-3 py-1 text-xs"
          >
            <Plus className="w-4 h-4 text-[#B8924A]" />
            Grant agency access
          </button>
        </div>

        {/* Form */}
        {isFormOpen && (
          <form onSubmit={handleSubmit} className="mb-4 p-3 bg-[#14181F] border border-[#B8924A]/50 text-xs font-mono space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#B8924A] mb-1 font-bold">ORGANIZATION NAME</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. First American Title"
                  className="w-full bg-[#1B2A4A] border border-[#B8924A] px-2.5 py-1.5 text-[#F6F2E9] font-sans"
                  required
                />
              </div>
              <div>
                <label className="block text-[#B8924A] mb-1 font-bold">COMPANY EMAIL</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. compliance@firstam.com"
                  className="w-full bg-[#1B2A4A] border border-[#B8924A] px-2.5 py-1.5 text-[#F6F2E9] font-sans"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="btn-secondary px-3 py-1 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary px-3 py-1 text-xs bg-[#3F6B4F] border-[#3F6B4F]"
              >
                Confirm grant
              </button>
            </div>
          </form>
        )}

        {/* Grants List */}
        <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar font-mono text-xs">
          {grants.length === 0 ? (
            <div className="py-8 text-center text-[#F6F2E9]/60 text-xs">
              No custom access grants active. Shared links reveal real-time validity status only.
            </div>
          ) : (
            grants.map((grant) => (
              <div
                key={grant.id}
                className="p-3 bg-[#14181F] border border-[#B8924A]/40 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#1B2A4A] text-[#B8924A] border border-[#B8924A]">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-serif font-bold text-sm text-[#F6F2E9]">{grant.grantedToName}</div>
                    <div className="text-[#B8924A] text-[11px]">{grant.grantedToEmail}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {grant.status === 'active' && (
                    <span className="badge-verified">
                      ACTIVE ACCESS
                    </span>
                  )}
                  {grant.status === 'pending_request' && (
                    <span className="badge-expiring">
                      REQUEST PENDING
                    </span>
                  )}
                  {grant.status === 'revoked' && (
                    <span className="badge-expired">
                      REVOKED
                    </span>
                  )}

                  {grant.status === 'pending_request' && onApproveRequest && (
                    <button
                      onClick={() => onApproveRequest(grant.id)}
                      className="btn-primary px-2.5 py-1 text-xs bg-[#3F6B4F] border-[#3F6B4F]"
                    >
                      Approve
                    </button>
                  )}

                  {grant.status !== 'revoked' && (
                    <button
                      onClick={() => onRevokeAccess(grant.id)}
                      className="p-1 text-[#7A3B34] hover:bg-[#7A3B34]/20 transition-all"
                      title="Revoke Access"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-[#B8924A]/40 flex justify-end font-mono">
          <button
            onClick={onClose}
            className="btn-secondary px-4 py-1.5 text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
