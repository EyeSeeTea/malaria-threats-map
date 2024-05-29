import { FutureData } from "../common/FutureData";
import { TotalStudiesInThemes } from "../entities/TotalStudiesInThemes";

export interface TotalStudiesRepository {
    getTotalStudiesInThemes(): FutureData<TotalStudiesInThemes | undefined>;
}
