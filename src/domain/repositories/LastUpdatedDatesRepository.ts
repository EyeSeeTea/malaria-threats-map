import { FutureData } from "../common/FutureData";
import { LastUpdatedDates } from "../entities/LastUpdateDates";

export interface LastUpdatedDatesRepository {
    get(): FutureData<LastUpdatedDates>;
}
