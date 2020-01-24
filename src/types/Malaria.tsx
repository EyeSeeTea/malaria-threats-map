export interface Study {
  OBJECTID: number;
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
