import { FutureData } from "../common/FutureData";
import { DownloadRepository } from "../repositories/DownloadRepository";
import { Download } from "../entities/Download";

export class SendDownloadUseCase {
    constructor(private downloadRepository: DownloadRepository) {}

    execute(download: Download): FutureData<void> {
        return this.downloadRepository.save(download);
    }
}
