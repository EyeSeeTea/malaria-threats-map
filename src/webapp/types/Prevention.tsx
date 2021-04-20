import {PreventionStudy} from "../../domain/entities/PreventionStudy";

export interface PreventionResponse {
    displayFieldName: string;
    features: PreventionFeature[];
    fieldAliases: FieldAlias[];
    fields: Field[];
}

export interface PreventionFeature {
    attributes: PreventionStudy;
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
