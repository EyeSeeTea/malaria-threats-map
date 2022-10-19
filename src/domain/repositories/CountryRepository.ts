import { FutureData } from "../common/FutureData";
import { Country } from "../entities/Country";

export interface CountryRepository {
    get(): FutureData<Country[]>;
}
