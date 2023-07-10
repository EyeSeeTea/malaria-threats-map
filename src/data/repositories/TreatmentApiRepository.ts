import { request } from "../common/request";
import { FutureData } from "../../domain/common/FutureData";
import { ApiParams, ApiResponse, XMartApiResponse } from "../common/types";
import { TreatmentRepository } from "../../domain/repositories/TreatmentRepository";
import { TreatmentStudy } from "../../domain/entities/TreatmentStudy";
import { Future } from "../../common/Future";

export class TreatmentApiRepository implements TreatmentRepository {
    constructor(private arcGisBaseUrl: string, private xmartBaseUrl: string) {}

    getStudies(): FutureData<TreatmentStudy[]> {
        const params: ApiParams = {
            f: "json",
            where: `1=1`,
            outFields: "*",
        };

        return Future.joinObj({
            treatmentArcGis: request<ApiResponse<TreatmentStudy>>({ url: `${this.arcGisBaseUrl}/6/query`, params }).map(
                response => response.features.map(feature => feature.attributes)
            ),
            amderoTes: request<XMartApiResponse<TreatmentStudy>>({
                url: `${this.xmartBaseUrl}/FACT_AMDERO_TES_VIEW`,
            }).map(response => response.value),
            amderoMm: request<XMartApiResponse<TreatmentStudy>>({
                url: `${this.xmartBaseUrl}/FACT_AMDERO_MM_VIEW`,
            }).map(response => response.value),
        }).map(({ treatmentArcGis, amderoTes, amderoMm }) => {
            return [...treatmentArcGis, ...amderoTes, ...amderoMm];
        });
    }
}
