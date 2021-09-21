import { FutureData } from "../common/FutureData";

export interface EmailRepository {
    send(subject:string, body:string, file: File): FutureData<void>;
}
