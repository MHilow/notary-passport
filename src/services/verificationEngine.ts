import { Credential, CredentialStatus, JurisdictionRequirement } from '../types';

/**
 * Calculates current verification status based on expiration dates and admin review status
 */
export function calculateCredentialStatus(cred: Credential): CredentialStatus {
  // If already rejected or explicitly pending admin review
  if (cred.status === 'rejected') return 'rejected';
  if (cred.status === 'pending' && !cred.verifiedAt) return 'pending';

  if (!cred.expiryDate) {
    return cred.verifiedAt ? 'verified' : 'pending';
  }

  const now = new Date();
  const expiry = new Date(cred.expiryDate);
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return 'expired';
  } else if (diffDays <= 30) {
    return 'expiring_soon';
  }

  return 'verified';
}

/**
 * Evaluates a Notary's credential portfolio against state/province mandatory rules
 */
export interface JurisdictionAuditResult {
  jurisdiction: JurisdictionRequirement;
  isFullyCompliant: boolean;
  missingRequirements: string[];
  expiringWarnings: string[];
  verifiedCount: number;
  totalRequired: number;
}

export function auditJurisdictionCompliance(
  credentials: Credential[],
  jurisdiction: JurisdictionRequirement
): JurisdictionAuditResult {
  const missingRequirements: string[] = [];
  const expiringWarnings: string[] = [];
  let verifiedCount = 0;
  let totalRequired = 2; // Commission + E&O minimum

  // 1. Commission check
  const commission = credentials.find(c => c.type === 'commission' && calculateCredentialStatus(c) !== 'expired');
  if (!commission) {
    missingRequirements.push('Valid State/Provincial Notary Commission Certificate');
  } else {
    verifiedCount++;
    if (calculateCredentialStatus(commission) === 'expiring_soon') {
      expiringWarnings.push('Commission Certificate expires within 30 days');
    }
  }

  // 2. E&O Insurance check
  const eo = credentials.find(c => c.type === 'insurance' && calculateCredentialStatus(c) !== 'expired');
  if (jurisdiction.requiresEoInsurance) {
    if (!eo) {
      missingRequirements.push(`E&O Insurance Policy (Min coverage: $${(jurisdiction.minInsuranceAmount || 25000).toLocaleString()})`);
    } else {
      verifiedCount++;
      if (calculateCredentialStatus(eo) === 'expiring_soon') {
        expiringWarnings.push('E&O Insurance Policy expires within 30 days');
      }
    }
  }

  // 3. Bond check if required
  if (jurisdiction.requiresBond) {
    totalRequired++;
    const bond = credentials.find(c => (c.type === 'bond' || c.title.toLowerCase().includes('bond')) && calculateCredentialStatus(c) !== 'expired');
    if (!bond) {
      missingRequirements.push(`State Surety Bond ($${(jurisdiction.bondAmountUsdOrCad || 10000).toLocaleString()})`);
    } else {
      verifiedCount++;
    }
  }

  // 4. Background Check if required
  if (jurisdiction.requiresBackgroundCheck) {
    totalRequired++;
    const bg = credentials.find(c => c.type === 'background_check' && calculateCredentialStatus(c) !== 'expired');
    if (!bg) {
      missingRequirements.push('Annual Background Screening Clearance (NNA/Sterling)');
    } else {
      verifiedCount++;
      if (calculateCredentialStatus(bg) === 'expiring_soon') {
        expiringWarnings.push('Background screening report renewal needed within 30 days');
      }
    }
  }

  return {
    jurisdiction,
    isFullyCompliant: missingRequirements.length === 0,
    missingRequirements,
    expiringWarnings,
    verifiedCount,
    totalRequired
  };
}
