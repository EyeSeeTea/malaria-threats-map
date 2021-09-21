import { FutureData } from "../../domain/common/FutureData";
import { EmailRepository } from "../../domain/repositories/FileRepository";
import { Future } from "../../common/Future";

export class SmtpJsEmailRepository implements EmailRepository {
    send(subject: string, body: string, file: File): FutureData<void> {
        return Future.fromComputation((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsBinaryString(file);
            reader.onload = function () {
                const dataUri = "data:" + file.type + ";base64," + btoa(reader.result as string);
                (window as any).Email.send({
                    SecureToken: "f33274c1-6707-44fe-9f15-80e7778ab0ce",
                    From: "mtm.filetest@gmail.com",
                    To: "mtm.filetest@gmail.com",
                    Subject: subject,
                    Body: body,
                    Attachments: [
                        {
                            name: file.name,
                            data: dataUri,
                        },
                    ],
                })
                    .then((message: any) => {
                        console.log({ message });
                        resolve(undefined);
                    })
                    .catch((err: any) => {
                        const message = (err && err.message) || "Unknown error";
                        console.log({ message });
                        reject(message);
                    });
            };
            reader.onerror = () => {
                console.log({ message: "Unknown error" });
                reject(new Error("Unknown error"));
            };

            return () => {};
        });
    }
}
