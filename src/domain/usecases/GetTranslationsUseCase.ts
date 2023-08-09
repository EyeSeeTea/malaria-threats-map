import { FutureData } from "../common/FutureData";
import { TranslationRepository } from "../repositories/TranslationRepository";
import { Translation } from "../entities/Translation";

export class GetTranslationsUseCase {
    constructor(private translationRepository: TranslationRepository) {}

    execute(): FutureData<Translation[]> {
        return this.translationRepository.get();
    }
}
