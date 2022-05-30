export interface TranslationResponse {
    displayFieldName: string;
    features: TranslationFeature[];
    fieldAliases: FieldAlias[];
    fields: Field[];
}

export interface TranslationXMartResponse {
    "@odata.context": string;
    value: Translation[];
}

interface TranslationFeature {
    attributes: Translation;
}

interface FieldAlias {
    [key: string]: string;
}

export interface Translation {
    OBJECTID: number;
    Code: string;
    DATASET: string;
    FIELD: string;
    VALUE_: string;
    EN: string;
    FR: string;
    ES: string;
    ACTIVE: string | null;
    NOTES: string;
}

interface Field {
    name: string;
    type: string;
    alias: string;
    length: number;
}
