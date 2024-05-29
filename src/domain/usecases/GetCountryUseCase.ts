import { FutureData } from "../common/FutureData";
import { Country } from "../entities/Country";
import { CountryRepository } from "../repositories/CountryRepository";

export class GetCountryUseCase {
    constructor(private countryRepository: CountryRepository) {}

    execute(): FutureData<Country[]> {
        return this.countryRepository.get();
    }
}
