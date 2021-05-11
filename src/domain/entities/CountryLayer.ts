export interface MultiPolygon {
    type: "MultiPolygon";
    coordinates: Position[][][];
}

export type Position = number[];

export interface CountryProperties {
    OBJECTID: number;
    ADM0_SOVRN: string;
    ADM0_NAME: string;
    SUBREGION?: string;
    REGION_FULL?: string;
    CENTER_LAT: number;
    CENTER_LON: number;
    ISO_2_CODE: string;
    ENDEMICITY: number;
    PBO_DEPLOYMENT_STATUS?: string;
}

export interface CountryFeature {
    type: string;
    id: number;
    geometry: MultiPolygon;
    properties: CountryProperties;
}

export interface CountryLayer {
    type: string;
    features: CountryFeature[];
}
