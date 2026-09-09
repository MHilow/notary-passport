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
import { PassportSeal } from './components/PassportSeal';
import { Credential } from './types';
import { StatusBadge } from './components/StatusBadge';
import { calculateCredentialStatus } from './services/verificationEngine';
import { X, Download, ShieldCheck, FileText } from 'lucide-react';

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
  const [viewingDocument, setViewingDocument] = useState<Credential | null>(null);

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
            onDeleteCredential={(id) => storage.deleteCredential(id)}
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
              alert(`Shared with ${company} on ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}.`);
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
              alert(`Access request logged for ${company}.`);
            }}
          />
        )}

        {mode === 'admin_queue' && (
          <AdminQueueView
            profile={profile}
            credentials={credentials}
            onVerify={(id, notes) => storage.updateCredentialStatus(id, 'verified', notes)}
            onReject={(id, reason) => storage.updateCredentialStatus(id, 'rejected', reason)}
            onViewDocument={(cred) => setViewingDocument(cred)}
          />
        )}

      </main>

      {/* Official Footer */}
      <footer className="border-t border-[#D8D2C6] bg-[#F6F2E9] py-6 text-center text-xs font-mono text-[#14181F]/70">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <PassportSeal size={28} variant="navy" />
            <span className="font-serif font-bold text-[#1B2A4A]">NOTARY PASSPORT</span>
            <span>— VERIFIED ONCE, TRUSTED EVERYWHERE</span>
          </div>
          <p>A portable credential for notaries across the U.S. and Canada</p>
        </div>
      </footer>

      {/* Modals */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={(data) => storage.addCredential(data)}
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
        onGrantAccess={(name, email) => storage.addAccessGrant(name, email)}
        onRevokeAccess={(id) => storage.revokeAccessGrant(id)}
        onApproveRequest={(id) => storage.approveAccessRequest(id)}
      />

      {/* Document Inspector Modal */}
      {viewingDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#14181F]/70 backdrop-blur-xs">
          <div className="bg-[#1B2A4A] text-[#F6F2E9] w-full max-w-2xl border-2 border-[#B8924A] p-6 corner-bracket shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#B8924A]/40">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#14181F] text-[#B8924A] border border-[#B8924A]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#F6F2E9]">{viewingDocument.title}</h3>
                  <p className="text-xs font-mono text-[#B8924A]">{viewingDocument.fileName} ({viewingDocument.fileSize})</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge status={calculateCredentialStatus(viewingDocument)} />
                <button
                  onClick={() => setViewingDocument(null)}
                  className="p-1 text-[#F6F2E9]/60 hover:text-[#F6F2E9]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Preview Box on Paper Cream Surface */}
            <div className="h-80 bg-[#F6F2E9] border-2 border-[#B8924A] p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="w-full max-w-md p-6 bg-[#F6F2E9] border border-[#1B2A4A] space-y-4 text-xs font-mono text-[#14181F]">
                <div className="flex items-center justify-between border-b border-[#D8D2C6] pb-3">
                  <div className="font-serif font-bold text-sm text-[#1B2A4A] flex items-center gap-2 uppercase">
                    <ShieldCheck className="w-4 h-4 text-[#3F6B4F]" />
                    Official Document Record
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

                <div className="badge-verified w-full text-center py-1.5">
                  OFFICIAL ENCRYPTED RECORD · VERIFIED
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 font-mono text-xs">
              <span className="text-[#F6F2E9]/70">
                Uploaded: {new Date(viewingDocument.uploadedAt).toLocaleDateString()}
              </span>
              <button
                onClick={() => alert(`Simulated Download: ${viewingDocument.fileName}`)}
                className="btn-primary"
              >
                <Download className="w-4 h-4 text-[#B8924A]" />
                Download document
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
