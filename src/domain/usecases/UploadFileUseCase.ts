import { FutureData } from "../common/FutureData";
import { EmailRepository } from "../repositories/FileRepository";

export interface UploadFileData {
    title: string;
    comment: string;
    file: File;
}

export class UploadFileUseCase {
    constructor(private fileRepository: EmailRepository) {}

    execute(data: UploadFileData): FutureData<void> {
        return this.fileRepository.send(data.title, data.comment, data.file);
    }
}
