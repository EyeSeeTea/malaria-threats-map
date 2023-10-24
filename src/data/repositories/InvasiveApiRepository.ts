import { request } from "../common/request";
import { FutureData } from "../../domain/common/FutureData";
import { XMartApiResponse } from "../common/types";
import { InvasiveRepository } from "../../domain/repositories/InvasiveRepository";
import { InvasiveStudy } from "../../domain/entities/InvasiveStudy";

export class InvasiveApiRepository implements InvasiveRepository {
    constructor(private xmartBaseUrl: string) {}

    getStudies(): FutureData<InvasiveStudy[]> {
        return request<XMartApiResponse<InvasiveStudy>>({
            url: `${this.xmartBaseUrl}/FACT_INVASIVE_VIEW`,
        }).map(response => response.value);
    }
}
