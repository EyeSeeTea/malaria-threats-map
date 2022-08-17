export type UserInfo = {
    firstName: string;
    lastName: string;
    organizationType: string;
    organizationName: string;
    uses: string;
    country: string;
    email: string;
    contactConsent: boolean;
    piConsent: boolean;
};

export type TermsInfo = {
    agreement: boolean;
};

export type DataInfo = {
    theme: string;
    preventionDataset: string;
    treatmentDataset: string;
    invasiveDataset: string;
    insecticideClasses: string[];
    insecticideTypes: string[];
    mechanismTypes: string[];
    molecularMarkers: string[];
    types: string[];
    synergistTypes: string[];
    plasmodiumSpecies: string[];
    species: string[];
    drugs: string[];
    years: number[];
    countries: string[];
};

export type Download = {
    firstName: string;
    lastName: string;
    organizationType: string;
    organizationName: string;
    uses: string;
    position: string;
    country: string;
    email: string;
    date: string;
    researchInfo: string;
    policiesInfo: string;
    contactConsent: boolean;
    organisationProjectConsent: boolean;
    toolsInfo: string;
    implementationCountries: string;
    theme: string;
    dataset: string;
};
