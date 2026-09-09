import React, { useState, useEffect } from 'react';
import { storage } from './services/storageService';
import { AppMode, Navbar } from './components/Navbar';
import { NotaryDashboard } from './views/NotaryDashboard';
import { PublicProfileView } from './views/PublicProfileView';
import { BusinessLookupView } from './views/BusinessLookupView';
import { AdminQueueView } from './views/AdminQueueView';
import { UploadModal } from './components/UploadModal';
import { AccessGrantModal } from './components/AccessGrantModal';
import { ShareLinkModal } from './components/ShareLinkModal';
import { JurisdictionDirectoryModal } from './components/JurisdictionDirectoryModal';
import { Toast, ToastMessage } from './components/Toast';
import { PassportSeal } from './components/PassportSeal';
import { ScallopedSeal } from './components/ScallopedSeal';
import { Credential } from './types';
import { StatusBadge } from './components/StatusBadge';
import { calculateCredentialStatus } from './services/verificationEngine';
import { X, Download, ShieldCheck, FileText, Building } from 'lucide-react';

export function App() {
  const [mode, setMode] = useState<AppMode>('notary_dashboard');
  const [profile, setProfile] = useState(storage.getProfile());
  const [credentials, setCredentials] = useState(storage.getCredentials());
  const [accessGrants, setAccessGrants] = useState(storage.getAccessGrants());
  const [logs, setLogs] = useState(storage.getLogs());

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isGrantsOpen, setIsGrantsOpen] = useState(false);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const [viewingDocument, setViewingDocument] = useState<Credential | null>(null);

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'info' | 'error', title: string, description?: string) => {
    setToasts(prev => [...prev, { id: Date.now().toString(), type, title, description }]);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Subscribe to storage changes
  useEffect(() => {
    const unsubscribe = storage.subscribe(() => {
      setProfile(storage.getProfile());
      setCredentials(storage.getCredentials());
      setAccessGrants(storage.getAccessGrants());
      setLogs(storage.getLogs());
    });
    return unsubscribe;
  }, []);

  const pendingCount = credentials.filter(c => c.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#F6F2E9] text-[#14181F] flex flex-col font-sans selection:bg-[#B8924A] selection:text-[#FFFFFF]">
      
      {/* Top Navbar */}
      <Navbar
        currentMode={mode}
        onModeChange={setMode}
        pendingCount={pendingCount}
        onOpenDirectory={() => setIsDirectoryOpen(true)}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {mode === 'notary_dashboard' && (
          <NotaryDashboard
            profile={profile}
            credentials={credentials}
            accessGrants={accessGrants}
            logs={logs}
            onOpenUpload={() => setIsUploadOpen(true)}
            onOpenShare={() => setIsShareOpen(true)}
            onOpenGrants={() => setIsGrantsOpen(true)}
            onOpenDirectory={() => setIsDirectoryOpen(true)}
            onDeleteCredential={(id) => {
              storage.deleteCredential(id);
              addToast('info', 'Credential Deleted', 'Record removed from local vault.');
            }}
            onViewDocument={(cred) => setViewingDocument(cred)}
          />
        )}

        {mode === 'public_profile' && (
          <PublicProfileView
            profile={profile}
            credentials={credentials}
            accessGrants={accessGrants}
            onRequestAccess={(company, email) => {
              storage.addAccessGrant(company, email);
              addToast('success', 'Access Request Submitted', `Shared permission request for ${company}.`);
            }}
          />
        )}

        {mode === 'business_lookup' && (
          <BusinessLookupView
            profile={profile}
            credentials={credentials}
            accessGrants={accessGrants}
            onViewDocument={(cred) => setViewingDocument(cred)}
            onRequestAccess={(company, email) => {
              storage.addAccessGrant(company, email);
              addToast('success', 'Agency Access Granted', `Viewing permissions requested for ${company}.`);
            }}
          />
        )}

        {mode === 'admin_queue' && (
          <AdminQueueView
            profile={profile}
            credentials={credentials}
            onVerify={(id, notes) => {
              storage.updateCredentialStatus(id, 'verified', notes);
              addToast('success', 'Credential Verified', 'Status updated to Verified on state registry.');
            }}
            onReject={(id, reason) => {
              storage.updateCredentialStatus(id, 'rejected', reason);
              addToast('error', 'Credential Rejected', 'Rejection reason logged to notary dashboard.');
            }}
            onViewDocument={(cred) => setViewingDocument(cred)}
          />
        )}

      </main>

      {/* Official Footer */}
      <footer className="border-t border-[#E2DBCF] bg-[#FFFFFF] py-6 text-center text-xs font-mono text-[#14181F]/70">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <PassportSeal size={36} variant="navy" className="drop-shadow-xs" />
            <span className="font-serif font-bold text-[#1B2A4A] text-sm">NOTARY PASSPORT</span>
            <span className="hidden sm:inline">— VERIFIED ONCE, TRUSTED EVERYWHERE</span>
          </div>
          <button
            onClick={() => setIsDirectoryOpen(true)}
            className="verify-state-btn text-[11px] py-1.5 px-3.5"
          >
            <Building className="w-3.5 h-3.5 text-[#B8924A]" />
            View Official Government Directory 🏛️
          </button>
        </div>
      </footer>

      {/* Floating Toast System */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Modals */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={(data) => {
          storage.addCredential(data);
          addToast('info', 'Credential Submitted', 'Document added to registrar verification queue.');
        }}
      />

      <ShareLinkModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        handle={profile.handle}
      />

      <AccessGrantModal
        isOpen={isGrantsOpen}
        onClose={() => setIsGrantsOpen(false)}
        grants={accessGrants}
        onGrantAccess={(name, email) => {
          storage.addAccessGrant(name, email);
          addToast('success', 'Access Granted', `Granted document access to ${name}.`);
        }}
        onRevokeAccess={(id) => {
          storage.revokeAccessGrant(id);
          addToast('info', 'Access Revoked', 'Permission revoked for specified organization.');
        }}
        onApproveRequest={(id) => {
          storage.approveAccessRequest(id);
          addToast('success', 'Request Approved', 'Organization granted document viewing access.');
        }}
      />

      <JurisdictionDirectoryModal
        isOpen={isDirectoryOpen}
        onClose={() => setIsDirectoryOpen(false)}
      />

      {/* Document Inspector Modal */}
      {viewingDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#14181F]/70 backdrop-blur-xs">
          <div className="bg-[#FFFFFF] text-[#14181F] w-full max-w-2xl rounded-3xl border-2 border-[#B8924A] p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#E2DBCF]">
              <div className="flex items-center gap-3.5">
                <PassportSeal size={44} variant="navy" className="shrink-0 drop-shadow-sm" />
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#1B2A4A]">{viewingDocument.title}</h3>
                  <p className="text-xs font-mono text-[#14181F]/60">{viewingDocument.fileName} ({viewingDocument.fileSize})</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge status={calculateCredentialStatus(viewingDocument)} />
                <button
                  onClick={() => setViewingDocument(null)}
                  className="w-8 h-8 rounded-full bg-[#F6F2E9] hover:bg-[#E2DBCF] text-[#14181F] flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document Preview Box */}
            <div className="h-80 rounded-2xl bg-[#F6F2E9] border-2 border-[#E2DBCF] p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="w-full max-w-md p-6 bg-[#FFFFFF] border border-[#E2DBCF] rounded-2xl space-y-4 text-xs font-mono text-[#14181F] shadow-md relative">
                <div className="flex items-center justify-between border-b border-[#E2DBCF] pb-3">
                  <div className="font-serif font-bold text-sm text-[#1B2A4A] flex items-center gap-2 uppercase">
                    <PassportSeal size={24} variant="gold" />
                    Official Government Record
                  </div>
                  <span className="font-mono text-[10px] text-[#14181F]/60">{viewingDocument.id}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-left text-[11px]">
                  <div>
                    <span className="text-[#14181F]/60 block uppercase">Issuing Authority</span>
                    <span className="text-[#14181F] font-bold">{viewingDocument.metadata?.issuingAuthority || 'State Registrar'}</span>
                  </div>
                  <div>
                    <span className="text-[#14181F]/60 block uppercase">Registration #</span>
                    <span className="text-[#1B2A4A] font-bold">{viewingDocument.metadata?.commissionNumber || viewingDocument.metadata?.policyNumber || 'TX-984201'}</span>
                  </div>
                  <div>
                    <span className="text-[#14181F]/60 block uppercase">Issue Date</span>
                    <span className="text-[#14181F] font-bold">{viewingDocument.issueDate}</span>
                  </div>
                  <div>
                    <span className="text-[#14181F]/60 block uppercase">Expiry Date</span>
                    <span className="text-[#14181F] font-bold">{viewingDocument.expiryDate || 'PERPETUAL'}</span>
                  </div>
                </div>

                <a
                  href={viewingDocument.metadata?.sourceRegistryUrl || 'https://direct.sos.state.tx.us/notary/search.asp'}
                  target="_blank"
                  rel="noreferrer"
                  className="verify-state-btn justify-center w-full py-2"
                >
                  <ShieldCheck className="w-4 h-4 text-[#B8924A]" />
                  Verify directly at {viewingDocument.metadata?.issuingAuthority || 'State SOS Registry'} ↗
                </a>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 font-mono text-xs">
              <span className="text-[#14181F]/70">
                Uploaded: {new Date(viewingDocument.uploadedAt).toLocaleDateString()}
              </span>
              <button
                onClick={() => addToast('info', 'Document Downloaded', `Saved ${viewingDocument.fileName} locally.`)}
                className="px-4 py-2 rounded-2xl bg-[#1B2A4A] text-[#F6F2E9] font-bold text-xs flex items-center gap-1.5 shadow-md"
              >
                <Download className="w-4 h-4 text-[#B8924A]" />
                Download PDF
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
