import { request } from "../common/request";
import { FutureData } from "../../domain/common/FutureData";
import { XMartApiResponse } from "../common/types";
import { TreatmentRepository } from "../../domain/repositories/TreatmentRepository";
import { TreatmentStudy } from "../../domain/entities/TreatmentStudy";

export class TreatmentApiRepository implements TreatmentRepository {
    constructor(private xmartBaseUrl: string) {}

    getStudies(): FutureData<TreatmentStudy[]> {
        return request<XMartApiResponse<any>>({
            url: `${this.xmartBaseUrl}/FACT_TREATMENT_VIEW`,
        }).map(response =>
            response.value.map(item => ({
                ...item,
                TREATMENT_FAILURE_KM: item.TREATMENT_FAILURE_KM / 100,
                TREATMENT_FAILURE_PP: item.TREATMENT_FAILURE_PP / 100,
                POSITIVE_DAY_3: item.POSITIVE_DAY_3 / 100,
            }))
        );
    }
}
