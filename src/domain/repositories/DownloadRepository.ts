import { FutureData } from "../common/FutureData";
import { Download } from "../entities/Download";

export interface  DownloadRepository {
    save(download:Download): FutureData<void> 
}