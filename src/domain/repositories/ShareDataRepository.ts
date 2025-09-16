import { FutureData } from "../common/FutureData";
import { ShareDataContent } from "../entities/ShareDataContent";

export interface ShareDataRepository {
    get(): FutureData<ShareDataContent>;
}
