import { request } from "../common/request";
import { FutureData } from "../../domain/common/FutureData";
import { ApiParams } from "../common/types";
import { CountryLayer } from "../../domain/entities/CountryLayer";
import { CountryLayerRepository } from "../../domain/repositories/CountryLayerRepository";

export class CountryLayerApiRepository implements CountryLayerRepository {
    constructor(private baseUrl: string) {}

    get(): FutureData<CountryLayer> {
        const params: ApiParams = {
            f: "geojson",
            where: `1=1`,
            outFields:
                "OBJECTID,ADM0_SOVRN,ADM0_NAME,SUBREGION,REGION_FULL,CENTER_LAT,CENTER_LON,ISO_2_CODE,ENDEMICITY",
        };

        return request<CountryLayer>({ url: `${this.baseUrl}/3/query`, params });
    }
}
