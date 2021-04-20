import {InvasiveStudy} from "../../domain/entities/InvasiveStudy";

export interface InvasiveResponse {
    displayFieldName: string;
    features: InvasiveFeature[];
    fieldAliases: FieldAlias[];
    fields: Field[];
}

export interface InvasiveFeature {
    attributes: InvasiveStudy;
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
