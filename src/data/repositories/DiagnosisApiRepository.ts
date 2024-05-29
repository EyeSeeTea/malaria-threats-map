import { request } from "../common/request";
import { FutureData } from "../../domain/common/FutureData";
import { XMartApiResponse } from "../common/types";
import { DiagnosisRepository } from "../../domain/repositories/DiagnosisRepository";
import { DiagnosisStudy } from "../../domain/entities/DiagnosisStudy";

export class DiagnosisApiRepository implements DiagnosisRepository {
    constructor(private xmartBaseUrl: string) {}

    getStudies(): FutureData<DiagnosisStudy[]> {
        return request<XMartApiResponse<DiagnosisStudy>>({
            url: `${this.xmartBaseUrl}/FACT_DIAGNOSIS_VIEW`,
        }).map(response => response.value);
    }
}
