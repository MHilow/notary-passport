import React, { useState } from 'react';
import { CredentialType, CredentialStatus } from '../types';
import { X, FileText, CheckCircle } from 'lucide-react';
import { PassportSeal } from './PassportSeal';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: {
    type: CredentialType;
    title: string;
    fileName: string;
    fileSize: string;
    fileUrl: string;
    issueDate: string;
    expiryDate?: string;
    jurisdictionCode?: string;
    status: CredentialStatus;
    metadata?: {
      policyNumber?: string;
      commissionNumber?: string;
    };
  }) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [type, setType] = useState<CredentialType>('insurance');
  const [title, setTitle] = useState('');
  const [fileName, setFileName] = useState('');
  const [issueDate, setIssueDate] = useState('2025-01-01');
  const [expiryDate, setExpiryDate] = useState('2027-01-01');
  const [jurisdictionCode, setJurisdictionCode] = useState('TX');
  const [policyNumber, setPolicyNumber] = useState('');
  const [commissionNumber, setCommissionNumber] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTitle = title.trim() || getDefaultTitle(type);
    const finalFileName = fileName.trim() || `${finalTitle.replace(/\s+/g, '_')}.pdf`;
    
    onUpload({
      type,
      title: finalTitle,
      fileName: finalFileName,
      fileSize: '1.2 MB',
      fileUrl: '#mock-pdf-new',
      issueDate,
      expiryDate: expiryDate || undefined,
      jurisdictionCode,
      status: 'pending',
      metadata: {
        policyNumber: policyNumber || undefined,
        commissionNumber: commissionNumber || undefined,
      }
    });
    onClose();
  };

  const getDefaultTitle = (t: CredentialType) => {
    switch (t) {
      case 'commission': return 'State Notary Public Commission';
      case 'insurance': return 'Errors & Omissions (E&O) Policy';
      case 'background_check': return 'Annual Background Screening Report';
      case 'id': return 'Government Issued Identification';
      case 'specialty': return 'Certified Loan Signing Agent Certificate';
      case 'bond': return 'State Surety Bond';
    }
  };

  const handleSimulatedFile = (name: string) => {
    setFileName(name);
    if (!title) {
      setTitle(getDefaultTitle(type));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#14181F]/70 backdrop-blur-xs">
      <div className="bg-[#1B2A4A] text-[#F6F2E9] w-full max-w-lg border-2 border-[#B8924A] p-6 corner-bracket shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#B8924A]/40">
          <div className="flex items-center gap-3.5">
            <PassportSeal size={60} variant="gold" className="drop-shadow-md" />
            <div>
              <h2 className="font-serif font-black text-xl sm:text-2xl text-[#F6F2E9]">Upload Credential</h2>
              <p className="text-xs font-mono font-bold text-[#B8924A]">Encrypted Submission Ledger</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#F6F2E9]/60 hover:text-[#F6F2E9]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs font-mono">
          
          {/* Category */}
          <div>
            <label className="block text-[#B8924A] font-bold mb-1 uppercase text-[11px]">CREDENTIAL CATEGORY</label>
            <select
              value={type}
              onChange={(e) => {
                const t = e.target.value as CredentialType;
                setType(t);
                setTitle(getDefaultTitle(t));
              }}
              className="w-full bg-[#14181F] border border-[#B8924A] px-3 py-2 text-[#F6F2E9] focus:outline-none"
            >
              <option value="commission">Notary Commission Certificate</option>
              <option value="insurance">Errors & Omissions (E&O) Insurance</option>
              <option value="background_check">Background Screening Report (NNA/Sterling)</option>
              <option value="id">Government ID (Driver's License / Passport)</option>
              <option value="specialty">Specialty Certification (Loan Signing / RON)</option>
              <option value="bond">State Surety Bond</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-[#B8924A] font-bold mb-1 uppercase text-[11px]">DOCUMENT TITLE</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Texas Commission Certificate 2024"
              className="w-full bg-[#14181F] border border-[#B8924A] px-3 py-2 text-[#F6F2E9] font-sans"
              required
            />
          </div>

          {/* Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              if (e.dataTransfer.files?.[0]) {
                handleSimulatedFile(e.dataTransfer.files[0].name);
              }
            }}
            className={`border-2 border-dashed p-4 text-center cursor-pointer transition-all ${
              isDragOver ? 'border-[#B8924A] bg-[#B8924A]/20' : 'border-[#B8924A]/50 bg-[#14181F]/60'
            }`}
            onClick={() => handleSimulatedFile(`${type}_document_${Date.now().toString().slice(-4)}.pdf`)}
          >
            <FileText className="w-8 h-8 mx-auto text-[#B8924A] mb-1" />
            {fileName ? (
              <div className="text-[#3F6B4F] font-bold flex items-center justify-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                SELECTED FILE: {fileName}
              </div>
            ) : (
              <div>
                <p className="text-[#F6F2E9] font-bold">Select or drag document file (PDF, PNG, JPG)</p>
                <p className="text-[10px] text-[#B8924A] mt-0.5">Encrypted AES-256 at rest</p>
              </div>
            )}
          </div>

          {/* Dates & Numbers */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#B8924A] font-bold mb-1 uppercase text-[11px]">ISSUE DATE</label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full bg-[#14181F] border border-[#B8924A] px-3 py-2 text-[#F6F2E9]"
                required
              />
            </div>

            <div>
              <label className="block text-[#B8924A] font-bold mb-1 uppercase text-[11px]">EXPIRATION DATE</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full bg-[#14181F] border border-[#B8924A] px-3 py-2 text-[#F6F2E9]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#B8924A] font-bold mb-1 uppercase text-[11px]">JURISDICTION</label>
              <select
                value={jurisdictionCode}
                onChange={(e) => setJurisdictionCode(e.target.value)}
                className="w-full bg-[#14181F] border border-[#B8924A] px-3 py-2 text-[#F6F2E9]"
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

            <div>
              {type === 'insurance' ? (
                <div>
                  <label className="block text-[#B8924A] font-bold mb-1 uppercase text-[11px]">POLICY NUMBER</label>
                  <input
                    type="text"
                    value={policyNumber}
                    onChange={(e) => setPolicyNumber(e.target.value)}
                    placeholder="e.g. EO-998231"
                    className="w-full bg-[#14181F] border border-[#B8924A] px-3 py-2 text-[#F6F2E9] font-sans"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-[#B8924A] font-bold mb-1 uppercase text-[11px]">COMMISSION #</label>
                  <input
                    type="text"
                    value={commissionNumber}
                    onChange={(e) => setCommissionNumber(e.target.value)}
                    placeholder="e.g. 13490182-9"
                    className="w-full bg-[#14181F] border border-[#B8924A] px-3 py-2 text-[#F6F2E9] font-sans"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Submit Buttons (Square Corners) */}
          <div className="pt-3 border-t border-[#B8924A]/40 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Submit document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
