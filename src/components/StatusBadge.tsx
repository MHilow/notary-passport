import React from 'react';
import { CredentialStatus } from '../types';

interface StatusBadgeProps {
  status: CredentialStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  switch (status) {
    case 'verified':
      return (
        <span className={`badge-verified ${className}`}>
          VERIFIED
        </span>
      );
    case 'expiring_soon':
      return (
        <span className={`badge-expiring ${className}`}>
          EXPIRING SOON
        </span>
      );
    case 'expired':
      return (
        <span className={`badge-expired ${className}`}>
          EXPIRED
        </span>
      );
    case 'pending':
      return (
        <span className={`badge-pending ${className}`}>
          PENDING REVIEW
        </span>
      );
    case 'rejected':
      return (
        <span className={`badge-expired ${className}`}>
          REJECTED
        </span>
      );
  }
};
