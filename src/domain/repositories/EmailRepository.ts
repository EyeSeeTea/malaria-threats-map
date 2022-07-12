import { FutureData } from "../common/FutureData";

export interface EmailRepository {
    send(from: string, to: string, subject: string, body: string, replyAddress?: string): FutureData<void>;
    sendFile(from: string, to: string, subject: string, body: string, file: File): FutureData<void>;
}
