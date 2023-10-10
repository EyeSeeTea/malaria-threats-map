import { FutureData } from "../common/FutureData";
import { LastUpdatedDatesRepository } from "../repositories/LastUpdatedDatesRepository";
import { LastUpdatedDates } from "../entities/LastUpdateDates";

export class GetLastUpdatedDatesUseCase {
    constructor(private lastUpdateDatesRepository: LastUpdatedDatesRepository) {}

    execute(): FutureData<LastUpdatedDates> {
        return this.lastUpdateDatesRepository.get();
    }
}
