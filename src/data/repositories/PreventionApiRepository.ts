import { request } from "../common/request";
import { FutureData } from "../../domain/common/FutureData";
import { PreventionStudy } from "../../domain/entities/PreventionStudy";
import { PreventionRepository } from "../../domain/repositories/PreventionRepository";
import { XMartApiResponse } from "../common/types";

export class PreventionApiRepository implements PreventionRepository {
    constructor(private xmartBaseUrl: string) {}

    getStudies(): FutureData<PreventionStudy[]> {
        return request<XMartApiResponse<PreventionStudy>>({
            url: `${this.xmartBaseUrl}/FACT_PREVENTION_VIEW`,
        }).map(response =>
            response.value.map(study => ({
                ...study,
                MORTALITY_ADJUSTED: (+study.MORTALITY_ADJUSTED / 100).toString(),
            }))
        );
    }
}
