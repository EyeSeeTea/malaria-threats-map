import { request } from "../common/request";
import { FutureData } from "../../domain/common/FutureData";
import { XMartApiResponse } from "../common/types";
import { InvasiveRepository } from "../../domain/repositories/InvasiveRepository";
import { InvasiveStudy } from "../../domain/entities/InvasiveStudy";

export class InvasiveApiRepository implements InvasiveRepository {
    constructor(private baseUrl: string) {}

    getStudies(): FutureData<InvasiveStudy[]> {
        const url = "https://frontdoor-r5quteqglawbs.azurefd.net/VECTORS_IR/FACT_EST_TEST_INVASIVE_SPECIES";

        return request<XMartApiResponse<InvasiveStudy>>({ url }).map(response => response.value);
    }
}
