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
        }).map(response => response.value);
    }
}
