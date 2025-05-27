import { FutureData } from "../common/FutureData";
import { ShareDataContent } from "../entities/ShareDataContent";
import { ShareDataRepository } from "../repositories/ShareDataRepository";

export class GetShareDataUseCase {
    constructor(private shareDataRepository: ShareDataRepository) {}

    execute(): FutureData<ShareDataContent> {
        return this.shareDataRepository.get();
    }
}
