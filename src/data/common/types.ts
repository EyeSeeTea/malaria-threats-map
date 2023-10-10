export interface ApiParams {
    [key: string]: string | number | boolean;
}

export interface ApiResponse<T> {
    displayFieldName: string;
    features: Feature<T>[];
    fieldAliases: FieldAlias[];
    fields: Field[];
}

export interface Feature<T> {
    attributes: T;
}

interface FieldAlias {
    [key: string]: string;
}

interface Field {
    name: string;
    type: string;
    alias: string;
    length: number;
}

export interface XMartApiResponse<T> {
    "@odata.context": string;
    value: T[];
}

export interface CountryData {
    name: string;
    iso2Code: string;
    region: string;
    subregion: string;
    endemicity: number;
}

export interface RefEndemicity {
    name: string;
    iso2Code: string;
    region: string;
    subregion: string;
    endemicity: number;
}

export interface RefCountry {
    CODE_ISO_3: string;
    CODE_ISO_2: string;
    NAME_SHORT_EN: string;
    NAME_FORMAL_EN: string;
    GRP_WHO_REGION: string;
}

export interface RefGeoRegion {
    GEO_REGION_CODE: string;
    GEO_REGION_NAME_SHORT: string;
    GEO_REGION_NAME_FULL: string;
}
