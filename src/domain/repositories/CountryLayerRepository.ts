import { FutureData } from "../common/FutureData";
import { CountryLayer } from "../entities/CountryLayer";

export interface CountryLayerRepository {
    get(): FutureData<CountryLayer>;
}
