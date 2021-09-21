import { FutureData } from "../common/FutureData";
import { FileRepository } from "../repositories/FileRepository";

export class UploadFileUseCase {
    constructor(private fileRepository: FileRepository) {}

    execute(file: File): FutureData<void> {
        return this.fileRepository.save(file);
    }
}
