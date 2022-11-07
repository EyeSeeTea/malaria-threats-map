import { request } from "../common/request";
import { FutureData } from "../../domain/common/FutureData";
import * as ajax from "../../webapp/store/ajax";
import { XMartApiResponse } from "../common/types";
import { TreatmentRepository } from "../../domain/repositories/TreatmentRepository";
import { TreatmentStudy } from "../../domain/entities/TreatmentStudy";

export class TreatmentApiRepository implements TreatmentRepository {
    constructor(private baseUrl: string) {}

    getStudies(): FutureData<TreatmentStudy[]> {
        const url = ajax.cacheCircunvent(this.baseUrl + "/FACT_AMDER");

        return request<XMartApiResponse<TreatmentStudy>>({ url }).map(response => response.value);
    }
}
