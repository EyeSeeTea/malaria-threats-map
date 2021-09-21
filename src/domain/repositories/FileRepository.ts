import { FutureData } from "../common/FutureData";

export interface FileRepository {
    save(file: File): FutureData<void>;
}
