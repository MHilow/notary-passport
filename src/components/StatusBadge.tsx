import React from 'react';
import { CredentialStatus } from '../types';
import { CheckCircle2, AlertTriangle, XCircle, Clock, ShieldAlert } from 'lucide-react';

interface StatusBadgeProps {
  status: CredentialStatus;
  className?: string;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '', showIcon = true }) => {
  switch (status) {
    case 'verified':
      return (
        <span className={`bubbly-pill bubbly-pill-verified ${className}`}>
          {showIcon && <CheckCircle2 className="w-3.5 h-3.5 text-[#3F6B4F]" />}
          State Verified
        </span>
      );
    case 'expiring_soon':
      return (
        <span className={`bubbly-pill bubbly-pill-gold ${className}`}>
          {showIcon && <AlertTriangle className="w-3.5 h-3.5 text-[#B8924A]" />}
          Expiring Soon
        </span>
      );
    case 'expired':
      return (
        <span className={`bubbly-pill bubbly-pill-oxblood ${className}`}>
          {showIcon && <XCircle className="w-3.5 h-3.5 text-[#7A3B34]" />}
          Expired
        </span>
      );
    case 'pending':
      return (
        <span className={`bubbly-pill bubbly-pill-navy ${className}`}>
          {showIcon && <Clock className="w-3.5 h-3.5 text-[#1B2A4A] animate-spin" style={{ animationDuration: '4s' }} />}
          Pending Verification
        </span>
      );
    case 'rejected':
      return (
        <span className={`bubbly-pill bubbly-pill-oxblood ${className}`}>
          {showIcon && <ShieldAlert className="w-3.5 h-3.5 text-[#7A3B34]" />}
          Action Needed
        </span>
      );
  }
};
