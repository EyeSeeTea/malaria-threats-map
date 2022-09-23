import { request } from "../common/request";
import { FutureData } from "../../domain/common/FutureData";
import { XMartApiResponse } from "../common/types";
import { Future } from "../../common/Future";
import { CountryContextRepository } from "../../domain/repositories/CountryContextRepository";
import { CountryContextData } from "../../domain/entities/CountryContextData";

export class CountryContextApiRepository implements CountryContextRepository {
    constructor(private baseUrl: string) {}

    get(): FutureData<CountryContextData[]> {
        return request<XMartApiResponse<CountryContextData>>({ url: `${this.baseUrl}/FACT_COUNTRY_CONTEXT` })
            .map(response => response.value)
            .flatMapError(error => {
                console.log("error loading country context from xmart", error);
                return Future.success([]);
            });
    }
}
