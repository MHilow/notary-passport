import { NotaryProfile, Credential, AccessGrant, VerificationLog } from '../types';

export const INITIAL_NOTARY_PROFILE: NotaryProfile = {
  id: 'np_1001',
  userId: 'usr_9901',
  handle: 'sarah-jenkins-tx',
  fullName: 'Sarah Jenkins, CNSA',
  email: 'sarah.jenkins.notary@example.com',
  phone: '(512) 555-0192',
  photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
  bio: 'Commissioned Texas Notary Public, NSSA Certified Loan Signing Agent & Authorized Remote Online Notary (RON) with 8+ years of title and closing experience.',
  primaryJurisdiction: 'TX',
  country: 'US',
  isRonApproved: true,
  signingLanguages: ['English', 'Spanish'],
  createdAt: '2024-01-15T10:00:00Z',
};

export const INITIAL_CREDENTIALS: Credential[] = [
  {
    id: 'cred_101',
    notaryProfileId: 'np_1001',
    type: 'commission',
    title: 'Texas State Notary Public Commission',
    jurisdictionCode: 'TX',
    fileName: 'Texas_Notary_Commission_Certificate_2024.pdf',
    fileSize: '1.4 MB',
    fileUrl: '#mock-pdf-commission',
    issueDate: '2024-02-01',
    expiryDate: '2028-02-01', // 2 years remaining -> Verified
    status: 'verified',
    uploadedAt: '2024-02-05T09:12:00Z',
    verifiedAt: '2024-02-05T14:30:00Z',
    verifiedBy: 'State Verification Admin (Official)',
    metadata: {
      commissionNumber: 'TX-13490182-9',
      issuingAuthority: 'Texas Secretary of State',
      sourceRegistryUrl: 'https://direct.sos.state.tx.us/notary/search.asp'
    }
  },
  {
    id: 'cred_102',
    notaryProfileId: 'np_1001',
    type: 'insurance',
    title: 'Errors & Omissions (E&O) Insurance Policy',
    fileName: 'Merchants_Bonding_EO_Insurance_100k.pdf',
    fileSize: '840 KB',
    fileUrl: '#mock-pdf-eo',
    issueDate: '2025-10-01',
    expiryDate: '2026-10-01', // Expiring in 23 days -> Expiring Soon!
    status: 'expiring_soon',
    uploadedAt: '2025-10-02T11:00:00Z',
    verifiedAt: '2025-10-03T10:15:00Z',
    verifiedBy: 'Compliance Admin',
    metadata: {
      policyNumber: 'EO-TX-984210',
      coverageAmount: 100000,
      issuingAuthority: 'Merchants Bonding Company'
    }
  },
  {
    id: 'cred_103',
    notaryProfileId: 'np_1001',
    type: 'background_check',
    title: 'NCSA Annual Background Screening Verification',
    fileName: 'NCSA_Background_Screening_Report_2025.pdf',
    fileSize: '2.1 MB',
    fileUrl: '#mock-pdf-bg',
    issueDate: '2025-08-15',
    expiryDate: '2026-08-15', // Expired!
    status: 'expired',
    uploadedAt: '2025-08-16T16:20:00Z',
    verifiedAt: '2025-08-17T09:00:00Z',
    verifiedBy: 'Background Verification Clearance Dept',
    metadata: {
      issuingAuthority: 'National Notary Association / Sterling'
    }
  },
  {
    id: 'cred_104',
    notaryProfileId: 'np_1001',
    type: 'id',
    title: 'State Issued Government Identification (Driver License)',
    fileName: 'Texas_Driver_License_Encrypted.pdf',
    fileSize: '1.1 MB',
    fileUrl: '#mock-pdf-id',
    issueDate: '2023-05-10',
    expiryDate: '2029-05-10',
    status: 'verified',
    uploadedAt: '2024-01-20T08:00:00Z',
    verifiedAt: '2024-01-20T12:00:00Z',
    verifiedBy: 'ID Authentication Automated OCR',
    metadata: {
      issuingAuthority: 'Texas Department of Public Safety'
    }
  },
  {
    id: 'cred_105',
    notaryProfileId: 'np_1001',
    type: 'specialty',
    title: 'Certified Loan Signing Agent Certificate (NNA)',
    fileName: 'NNA_Loan_Signing_Agent_Certification.pdf',
    fileSize: '920 KB',
    fileUrl: '#mock-pdf-specialty',
    issueDate: '2024-03-01',
    expiryDate: '2028-03-01',
    status: 'verified',
    uploadedAt: '2024-03-02T14:10:00Z',
    verifiedAt: '2024-03-03T11:45:00Z',
    verifiedBy: 'NNA Credential API',
    metadata: {
      issuingAuthority: 'National Notary Association',
      sourceRegistryUrl: 'https://www.nationalnotary.org/verify'
    }
  },
  {
    id: 'cred_106',
    notaryProfileId: 'np_1001',
    type: 'specialty',
    title: 'Texas Remote Online Notarization (RON) Endorsement',
    jurisdictionCode: 'TX',
    fileName: 'TX_RON_Digital_Certificate_2026.pdf',
    fileSize: '1.8 MB',
    fileUrl: '#mock-pdf-ron',
    issueDate: '2026-09-01',
    expiryDate: '2030-09-01',
    status: 'pending', // Pending Admin Review!
    uploadedAt: '2026-09-07T18:45:00Z',
    metadata: {
      commissionNumber: 'RON-TX-88390',
      issuingAuthority: 'IdentTrust / TX Secretary of State',
      sourceRegistryUrl: 'https://direct.sos.state.tx.us/notary/search.asp'
    }
  }
];

export const INITIAL_ACCESS_GRANTS: AccessGrant[] = [
  {
    id: 'ag_301',
    notaryProfileId: 'np_1001',
    grantedToName: 'First American Title Company',
    grantedToEmail: 'vendor-onboarding@firstam.com',
    accessLevel: 'document_view',
    grantedAt: '2025-11-10T14:22:00Z',
    expiresAt: '2026-11-10T14:22:00Z',
    status: 'active'
  },
  {
    id: 'ag_302',
    notaryProfileId: 'np_1001',
    grantedToName: 'Snapdocs Vendor Management',
    grantedToEmail: 'compliance@snapdocs.com',
    accessLevel: 'document_view',
    grantedAt: '2026-01-05T09:15:00Z',
    status: 'active'
  },
  {
    id: 'ag_303',
    notaryProfileId: 'np_1001',
    grantedToName: 'Fidelity National Title Agency',
    grantedToEmail: 'notaries@fntg.com',
    accessLevel: 'document_view',
    grantedAt: '2026-09-08T15:30:00Z',
    status: 'pending_request'
  }
];

export const INITIAL_LOGS: VerificationLog[] = [
  {
    id: 'log_501',
    credentialId: 'cred_106',
    action: 'uploaded',
    actorName: 'Sarah Jenkins',
    actorRole: 'notary',
    timestamp: '2026-09-07T18:45:00Z',
    notes: 'Uploaded Texas RON Digital Certificate'
  },
  {
    id: 'log_502',
    credentialId: 'cred_102',
    action: 'viewed',
    actorName: 'First American Title',
    actorRole: 'business_viewer',
    timestamp: '2026-09-08T11:20:00Z',
    notes: 'Viewed E&O Insurance Policy under Active Grant'
  }
];
