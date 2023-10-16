import { FutureData } from "../common/FutureData";
import { Translation } from "../entities/Translation";

export interface TranslationRepository {
    get(): FutureData<Translation[]>;
}
