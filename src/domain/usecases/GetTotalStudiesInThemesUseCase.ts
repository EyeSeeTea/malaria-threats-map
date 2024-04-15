import { FutureData } from "../common/FutureData";
import { TotalStudiesInThemes } from "../entities/TotalStudiesInThemes";
import { TotalStudiesRepository } from "../repositories/TotalStudiesRepository";

export class GetTotalStudiesInThemesUseCase {
    constructor(private totalStudiesRepository: TotalStudiesRepository) {}

    execute(): FutureData<TotalStudiesInThemes | undefined> {
        return this.totalStudiesRepository.getTotalStudiesInThemes();
    }
}
