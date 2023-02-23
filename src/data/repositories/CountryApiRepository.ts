import { FutureData } from "../../domain/common/FutureData";
import { CountryRepository } from "../../domain/repositories/CountryRepository";
import { Country } from "../../domain/entities/Country";
import { getBackendCountries } from "./common/getBackendCountries";
export class CountryApiRepository implements CountryRepository {
    constructor(private xmartBaseUrl: string) {}

    get(): FutureData<Country[]> {
        return getBackendCountries(this.xmartBaseUrl).map(countries =>
            countries.map(country => ({
                name: country.name,
                iso2Code: country.iso2Code,
                region: country.region,
                subregion: country.subregion,
                endemicity: country.endemicity === 1,
            }))
        );
    }
}
