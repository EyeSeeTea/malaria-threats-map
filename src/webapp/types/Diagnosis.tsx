import {DiagnosisStudy} from "../../domain/entities/DiagnosisStudy";

export interface DiagnosisResponse {
    displayFieldName: string;
    features: DiagnosisFeature[];
    fieldAliases: FieldAlias[];
    fields: Field[];
}

export interface DiagnosisFeature {
    attributes: DiagnosisStudy;
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
