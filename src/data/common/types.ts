export interface ApiParams {
    [key: string]: string | number | boolean;
}

export interface ApiResponse<T> {
    displayFieldName: string;
    features: Feature<T>[];
    fieldAliases: FieldAlias[];
    fields: Field[];
}

interface Feature<T> {
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
