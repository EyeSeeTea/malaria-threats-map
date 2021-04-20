import {TreatmentStudy} from "../../domain/entities/TreatmentStudy";

export interface TreatmentResponse {
    displayFieldName: string;
    features: TreatmentFeature[];
    fieldAliases: FieldAlias[];
    fields: Field[];
}

export interface TreatmentFeature {
    attributes: TreatmentStudy;
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
