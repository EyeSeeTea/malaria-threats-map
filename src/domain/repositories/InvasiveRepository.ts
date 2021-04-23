import { FutureData } from "../common/FutureData";
import { InvasiveStudy } from "../entities/InvasiveStudy";

export interface InvasiveRepository {
    getStudies(): FutureData<InvasiveStudy[]>
}