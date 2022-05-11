import { request } from "../common/request";
import { FutureData } from "../../domain/common/FutureData";
import { ApiParams, ApiResponse, XmartResponse } from "../common/types";
import { TreatmentRepository } from "../../domain/repositories/TreatmentRepository";
import { TreatmentStudy } from "../../domain/entities/TreatmentStudy";

export class TreatmentApiRepository implements TreatmentRepository {
    constructor(private baseUrl: string) {}

    getStudies(): FutureData<TreatmentStudy[]> {

        return request<XmartResponse<TreatmentStudy>>({ url: `https://frontdoor-r5quteqglawbs.azurefd.net/TRAINING_EYESEETEA/MTM_TREATMENT_TEST` }).map(response =>
            response.value.map( value  => value)
        );
    }
}



    