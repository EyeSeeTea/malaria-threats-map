import { CountryContextApiRepository } from "../../data/repositories/CountryContextApiRepository";
import { FutureData } from "../common/FutureData";
import { CountryContextData } from "../entities/CountryContextData";

export class GetCountryContextUseCase {
    constructor(private countryContextRepository: CountryContextApiRepository) {}

    execute(): FutureData<CountryContextData[]> {
        return this.countryContextRepository.get();
    }
}
