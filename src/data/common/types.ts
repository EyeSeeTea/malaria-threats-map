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

export interface FieldAlias {
    [key: string]: string;
}

export interface Field {
    name: string;
    type: string;
    alias: string;
    length: number;
}
