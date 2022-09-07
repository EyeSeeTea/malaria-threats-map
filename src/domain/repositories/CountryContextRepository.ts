import { FutureData } from "../common/FutureData";
import { CountryContextData } from "../entities/CountryContextData";

export interface CountryContextRepository {
    get(): FutureData<CountryContextData[]>;
}
