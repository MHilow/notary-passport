import { JurisdictionRequirement } from '../types';

export const JURISDICTIONS: JurisdictionRequirement[] = [
  // UNITED STATES JURISDICTIONS
  {
    id: 'US-TX',
    country: 'US',
    stateOrProvince: 'TX',
    name: 'Texas',
    commissionTermYears: 4,
    requiresBond: true,
    bondAmountUsdOrCad: 10000,
    requiresEoInsurance: true,
    minInsuranceAmount: 25000,
    requiresBackgroundCheck: true,
    ronAllowed: true,
    officialRegistryUrl: 'https://direct.sos.state.tx.us/notary/search.asp',
    notes: 'Requires $10,000 state bond. Remote Online Notarization (RON) authorization requires separate state registration & digital certificate.'
  },
  {
    id: 'US-CA',
    country: 'US',
    stateOrProvince: 'CA',
    name: 'California',
    commissionTermYears: 4,
    requiresBond: true,
    bondAmountUsdOrCad: 15000,
    requiresEoInsurance: true,
    minInsuranceAmount: 100000,
    requiresBackgroundCheck: true,
    ronAllowed: true,
    officialRegistryUrl: 'https://notary.cdn.sos.ca.gov/search',
    notes: 'Requires $15,000 surety bond, mandatory Live Scan background check, and 6-hour approved course.'
  },
  {
    id: 'US-FL',
    country: 'US',
    stateOrProvince: 'FL',
    name: 'Florida',
    commissionTermYears: 4,
    requiresBond: true,
    bondAmountUsdOrCad: 7500,
    requiresEoInsurance: true,
    minInsuranceAmount: 25000,
    requiresBackgroundCheck: true,
    ronAllowed: true,
    officialRegistryUrl: 'https://notaries.dos.state.fl.us/notarysearch',
    notes: 'RON notary requires a $25,000 E&O policy and completion of a 2-hour state-approved RON course.'
  },
  {
    id: 'US-NY',
    country: 'US',
    stateOrProvince: 'NY',
    name: 'New York',
    commissionTermYears: 4,
    requiresBond: false,
    requiresEoInsurance: true,
    minInsuranceAmount: 25000,
    requiresBackgroundCheck: true,
    ronAllowed: true,
    officialRegistryUrl: 'https://dos.ny.gov/licensing-services',
    notes: 'Electronic notarization allowed under Executive Law 135-c. Notaries must register with Department of State.'
  },
  {
    id: 'US-OH',
    country: 'US',
    stateOrProvince: 'OH',
    name: 'Ohio',
    commissionTermYears: 5,
    requiresBond: false,
    requiresEoInsurance: true,
    minInsuranceAmount: 25000,
    requiresBackgroundCheck: true,
    ronAllowed: true,
    officialRegistryUrl: 'https://notary.ohiosos.gov/search',
    notes: 'Criminal records check required. Online Notary authorization requires 5-year online commission.'
  },

  // CANADIAN JURISDICTIONS
  {
    id: 'CA-ON',
    country: 'CA',
    stateOrProvince: 'ON',
    name: 'Ontario',
    commissionTermYears: 3,
    requiresBond: false,
    requiresEoInsurance: true,
    minInsuranceAmount: 1000000,
    requiresBackgroundCheck: true,
    ronAllowed: true,
    officialRegistryUrl: 'https://lso.ca/public-resources/finding-a-lawyer-or-paralegal',
    notes: 'Governed by the Notaries Act. Remote commissioning permitted under Law Society guidelines.'
  },
  {
    id: 'CA-BC',
    country: 'CA',
    stateOrProvince: 'BC',
    name: 'British Columbia',
    commissionTermYears: 3,
    requiresBond: true,
    bondAmountUsdOrCad: 5000,
    requiresEoInsurance: true,
    minInsuranceAmount: 1000000,
    requiresBackgroundCheck: true,
    ronAllowed: true,
    officialRegistryUrl: 'https://www.snpbc.ca/find-a-notary/',
    notes: 'Supervised by the Society of Notaries Public of BC. Mandatory professional indemnity insurance.'
  },
  {
    id: 'CA-AB',
    country: 'CA',
    stateOrProvince: 'AB',
    name: 'Alberta',
    commissionTermYears: 2,
    requiresBond: false,
    requiresEoInsurance: true,
    minInsuranceAmount: 500000,
    requiresBackgroundCheck: true,
    ronAllowed: true,
    officialRegistryUrl: 'https://www.alberta.ca/notaries-public',
    notes: 'Notary appointments issued by Minister of Justice. Virtual witnessing supported.'
  }
];

export const getJurisdiction = (code: string): JurisdictionRequirement | undefined => {
  return JURISDICTIONS.find(j => j.stateOrProvince.toUpperCase() === code.toUpperCase());
};
