import { request } from "../common/request";
import { FutureData } from "../../domain/common/FutureData";
import { Download } from "../../domain/entities/Download";
import { DownloadRepository } from "../../domain/repositories/DownloadRepository";

export class DownloadApiRepository implements DownloadRepository {
    constructor(private backendUrl: string) {}

    save(download: Download): FutureData<void> {
        return request<string>({
            method: "post",
            url: `${this.backendUrl}/downloads`,
            data: download,
        }).map(() => undefined);
    }
}
