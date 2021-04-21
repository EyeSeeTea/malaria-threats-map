
import { request } from "../common/request"
import { FutureData } from "../../domain/common/FutureData";
import { PreventionStudy } from "../../domain/entities/PreventionStudy";
import { PreventionRepository } from "../../domain/repositories/PreventionRepository";

interface Params {
    [key: string]: string | number | boolean;
}

export class PreventionApiRepository implements PreventionRepository {
    constructor(private baseUrl: string) { }

    getStudies(): FutureData<PreventionStudy[]> {
        const params: Params = {
            f: "json",
            where: `1=1`,
            outFields: "*",
        };

        return request<PreventionResponse>({ url: `${this.baseUrl}/5/query`, params })
            .map(response => response.features.map((feature) => feature.attributes));
    }
}

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