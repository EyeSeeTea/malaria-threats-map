import { request } from "../common/request";
import { FutureData } from "../../domain/common/FutureData";
import { Future } from "../../common/Future";
import { CountryRepository } from "../../domain/repositories/CountryRepository";
import { Country } from "../../domain/entities/Country";

export interface CountryData {
    name: string;
    iso2Code: string;
    region: string;
    subregion: string;
    endemicity: number;
}

export class CountryApiRepository implements CountryRepository {
    constructor(private backedBaseUrl: string) {}

    get(): FutureData<Country[]> {
        return request<CountryData[]>({ url: `${this.backedBaseUrl}` })
            .map(countries =>
                countries.map(country => ({
                    name: country.name,
                    iso2Code: country.iso2Code,
                    region: country.region,
                    subregion: country.subregion,
                    endemicity: country.endemicity === 1,
                }))
            )
            .flatMapError(error => {
                console.log("error loading countries from backend", error);
                return Future.success([]);
            });
    }
}
