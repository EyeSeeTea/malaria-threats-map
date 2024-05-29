import { FutureData } from "../common/FutureData";
import { EmailRepository } from "../repositories/EmailRepository";

export interface UploadFileData {
    title: string;
    comment: string;
    country: string;
    organizationType: string;
    file: File;
}

export class UploadFileUseCase {
    constructor(
        private fileRepository: EmailRepository,
        private feedbackEmailFrom: string,
        private feedbackEmailTo: string
    ) {}

    execute(data: UploadFileData): FutureData<void> {
        const body = `Country of residency: ${data.country}. Organization type: ${data.organizationType}. Comment: ${data.comment}`;
        return this.fileRepository.sendFile(this.feedbackEmailFrom, this.feedbackEmailTo, data.title, body, data.file);
    }
}
