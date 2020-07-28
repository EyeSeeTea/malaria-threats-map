export interface Study {
  OBJECTID: number;
  VILLAGE_NAME: string;
  SITE_ID: string;
  ISO2: string;
  CITATION_LONG: string;
  INSTITUTE_CURATION: string;
  CURATION: string;
  CITATION_URL: string;
  CITATION: string;
  Latitude: string;
  Longitude: string;
  INSTITUTION?: string;
  INSTITUTION_CITY?: string;
}

export interface ErrorResponse {
  error: {
    code: number;
    message: string;
    details: string[];
  };
}
