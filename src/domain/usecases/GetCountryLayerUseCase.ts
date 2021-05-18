import { FutureData } from "../common/FutureData";
import { CountryLayer } from "../entities/CountryLayer";
import { CountryLayerRepository } from "../repositories/CountryLayerRepository";

export class GetCountryLayerUseCase {
    constructor(private countryLayerRepository: CountryLayerRepository) {}

    execute(): FutureData<CountryLayer> {
        return this.countryLayerRepository.get();
    }
}
