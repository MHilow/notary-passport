import { NotaryProfile, Credential, AccessGrant, VerificationLog } from '../types';
import { INITIAL_NOTARY_PROFILE, INITIAL_CREDENTIALS, INITIAL_ACCESS_GRANTS, INITIAL_LOGS } from '../data/mockData';

const STORAGE_KEYS = {
  PROFILE: 'notary_passport_profile_v1',
  CREDENTIALS: 'notary_passport_credentials_v1',
  ACCESS_GRANTS: 'notary_passport_grants_v1',
  LOGS: 'notary_passport_logs_v1',
};

class StorageService {
  private profile: NotaryProfile;
  private credentials: Credential[];
  private accessGrants: AccessGrant[];
  private logs: VerificationLog[];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.profile = this.load(STORAGE_KEYS.PROFILE, INITIAL_NOTARY_PROFILE);
    this.credentials = this.load(STORAGE_KEYS.CREDENTIALS, INITIAL_CREDENTIALS);
    this.accessGrants = this.load(STORAGE_KEYS.ACCESS_GRANTS, INITIAL_ACCESS_GRANTS);
    this.logs = this.load(STORAGE_KEYS.LOGS, INITIAL_LOGS);
  }

  private load<T>(key: string, fallback: T): T {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  }

  private save<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      this.notify();
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach(cb => cb());
  }

  // --- PROFILE ---
  public getProfile(): NotaryProfile {
    return { ...this.profile };
  }

  public updateProfile(updates: Partial<NotaryProfile>): void {
    this.profile = { ...this.profile, ...updates };
    this.save(STORAGE_KEYS.PROFILE, this.profile);
  }

  // --- CREDENTIALS ---
  public getCredentials(): Credential[] {
    return [...this.credentials];
  }

  public addCredential(cred: Omit<Credential, 'id' | 'uploadedAt' | 'notaryProfileId'>): Credential {
    const newCred: Credential = {
      ...cred,
      id: `cred_${Date.now()}`,
      notaryProfileId: this.profile.id,
      uploadedAt: new Date().toISOString(),
    };
    this.credentials = [newCred, ...this.credentials];
    this.save(STORAGE_KEYS.CREDENTIALS, this.credentials);

    this.logAction(newCred.id, 'uploaded', this.profile.fullName, 'notary', `Uploaded ${newCred.title}`);
    return newCred;
  }

  public updateCredentialStatus(id: string, status: Credential['status'], notes?: string, actorName = 'Admin'): void {
    this.credentials = this.credentials.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status,
          verifiedAt: status === 'verified' ? new Date().toISOString() : c.verifiedAt,
          verifiedBy: status === 'verified' ? actorName : c.verifiedBy,
          rejectionReason: status === 'rejected' ? notes : c.rejectionReason,
        };
      }
      return c;
    });
    this.save(STORAGE_KEYS.CREDENTIALS, this.credentials);

    const action = status === 'verified' ? 'verified' : status === 'rejected' ? 'rejected' : 'uploaded';
    this.logAction(id, action, actorName, 'admin', notes || `Updated status to ${status}`);
  }

  public deleteCredential(id: string): void {
    this.credentials = this.credentials.filter(c => c.id !== id);
    this.save(STORAGE_KEYS.CREDENTIALS, this.credentials);
  }

  // --- ACCESS GRANTS ---
  public getAccessGrants(): AccessGrant[] {
    return [...this.accessGrants];
  }

  public addAccessGrant(granteeName: string, granteeEmail: string): AccessGrant {
    const newGrant: AccessGrant = {
      id: `ag_${Date.now()}`,
      notaryProfileId: this.profile.id,
      grantedToName: granteeName,
      grantedToEmail: granteeEmail,
      accessLevel: 'document_view',
      grantedAt: new Date().toISOString(),
      status: 'active',
    };
    this.accessGrants = [newGrant, ...this.accessGrants];
    this.save(STORAGE_KEYS.ACCESS_GRANTS, this.accessGrants);
    return newGrant;
  }

  public revokeAccessGrant(id: string): void {
    this.accessGrants = this.accessGrants.map(g => {
      if (g.id === id) {
        return { ...g, status: 'revoked', revokedAt: new Date().toISOString() };
      }
      return g;
    });
    this.save(STORAGE_KEYS.ACCESS_GRANTS, this.accessGrants);
  }

  public approveAccessRequest(id: string): void {
    this.accessGrants = this.accessGrants.map(g => {
      if (g.id === id) {
        return { ...g, status: 'active', grantedAt: new Date().toISOString() };
      }
      return g;
    });
    this.save(STORAGE_KEYS.ACCESS_GRANTS, this.accessGrants);
  }

  // --- LOGS ---
  public getLogs(): VerificationLog[] {
    return [...this.logs];
  }

  private logAction(
    credentialId: string,
    action: VerificationLog['action'],
    actorName: string,
    actorRole: VerificationLog['actorRole'],
    notes?: string
  ): void {
    const newLog: VerificationLog = {
      id: `log_${Date.now()}`,
      credentialId,
      action,
      actorName,
      actorRole,
      timestamp: new Date().toISOString(),
      notes,
    };
    this.logs = [newLog, ...this.logs];
    this.save(STORAGE_KEYS.LOGS, this.logs);
  }

  // --- RESET DEMO DATA ---
  public resetToDefault(): void {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.CREDENTIALS);
    localStorage.removeItem(STORAGE_KEYS.ACCESS_GRANTS);
    localStorage.removeItem(STORAGE_KEYS.LOGS);
    this.profile = INITIAL_NOTARY_PROFILE;
    this.credentials = INITIAL_CREDENTIALS;
    this.accessGrants = INITIAL_ACCESS_GRANTS;
    this.logs = INITIAL_LOGS;
    this.notify();
  }
}

export const storage = new StorageService();
