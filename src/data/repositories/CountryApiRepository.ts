import { request } from "../common/request";
import { FutureData } from "../../domain/common/FutureData";
import { Future } from "../../common/Future";
import { CountryRepository } from "../../domain/repositories/CountryRepository";
import { Country } from "../../domain/entities/Country";
import { CountryData, XMartApiResponse } from "../common/types";
export class CountryApiRepository implements CountryRepository {
    constructor(private xmartBaseUrl: string) {}

    get(): FutureData<Country[]> {
        return this.getBackendCountries().map(countries =>
            countries.map(country => ({
                name: country.name,
                iso2Code: country.iso2Code,
                region: country.region,
                subregion: country.subregion,
                endemicity: country.endemicity === 1,
            }))
        );
    }

    private getBackendCountries(): FutureData<CountryData[]> {
        return request<XMartApiResponse<CountryData>>({ url: `${this.xmartBaseUrl}/FACT_ENDEMICITY_REGIONS` })
            .map(response => response.value)
            .flatMapError(error => {
                console.log("error loading countries from xmart", error);
                return Future.success([]);
            });
    }
}
