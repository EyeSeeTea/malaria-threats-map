import { FutureData } from "../common/FutureData";
import { EmailRepository } from "../repositories/FileRepository";

export interface UploadFileData {
    title: string;
    comment: string;
    country: string;
    organizationType: string;
    file: File;
}

export class UploadFileUseCase {
    constructor(private fileRepository: EmailRepository) {}

    execute(data: UploadFileData): FutureData<void> {
        const body = `Country of residency: ${data.country}. Organization type: ${data.organizationType}. Comment: ${data.comment}`;
        return this.fileRepository.send(data.title, body, data.file);
    }
}
