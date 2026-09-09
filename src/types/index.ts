export type Country = 'US' | 'CA';

export type CredentialType = 
  | 'commission' 
  | 'insurance' 
  | 'id' 
  | 'background_check' 
  | 'specialty' 
  | 'bond';

export type CredentialStatus = 'pending' | 'verified' | 'expiring_soon' | 'expired' | 'rejected';

export type AccessLevel = 'public_status' | 'document_view';

export interface User {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
  role: 'notary' | 'business' | 'admin';
}

export interface NotaryProfile {
  id: string;
  userId: string;
  handle: string; // e.g. "jane-doe-tx"
  fullName: string;
  email: string;
  phone: string;
  photoUrl?: string;
  bio?: string;
  primaryJurisdiction: string; // e.g. "TX" or "ON"
  country: Country;
  isRonApproved: boolean;
  signingLanguages: string[];
  createdAt: string;
}

export interface JurisdictionRequirement {
  id: string;
  country: Country;
  stateOrProvince: string;
  name: string;
  commissionTermYears: number;
  requiresBond: boolean;
  bondAmountUsdOrCad?: number;
  requiresEoInsurance: boolean;
  minInsuranceAmount?: number;
  requiresBackgroundCheck: boolean;
  ronAllowed: boolean;
  notes: string;
}

export interface NotaryJurisdiction {
  id: string;
  notaryProfileId: string;
  jurisdictionCode: string; // e.g. "TX"
  country: Country;
  commissionNumber: string;
  commissionExpiry: string;
}

export interface Credential {
  id: string;
  notaryProfileId: string;
  type: CredentialType;
  title: string;
  jurisdictionCode?: string; // Optional state/province
  fileName: string;
  fileSize: string;
  fileUrl: string; // Data URL or object URL
  issueDate: string;
  expiryDate?: string;
  status: CredentialStatus;
  uploadedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
  metadata?: {
    policyNumber?: string;
    coverageAmount?: number;
    issuingAuthority?: string;
    commissionNumber?: string;
  };
}

export interface AccessGrant {
  id: string;
  notaryProfileId: string;
  grantedToName: string; // e.g., "First American Title", "Snapdocs"
  grantedToEmail: string;
  accessLevel: AccessLevel;
  grantedAt: string;
  expiresAt?: string;
  revokedAt?: string;
  status: 'active' | 'pending_request' | 'revoked' | 'expired';
}

export interface VerificationLog {
  id: string;
  credentialId: string;
  action: 'uploaded' | 'verified' | 'rejected' | 'viewed' | 'access_granted' | 'access_revoked';
  actorName: string;
  actorRole: 'notary' | 'admin' | 'business_viewer';
  timestamp: string;
  notes?: string;
}
