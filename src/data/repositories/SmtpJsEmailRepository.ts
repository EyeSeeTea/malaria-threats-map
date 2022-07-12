import { FutureData } from "../../domain/common/FutureData";
import { EmailRepository } from "../../domain/repositories/EmailRepository";
import { Future } from "../../common/Future";

export class SmtpJsEmailRepository implements EmailRepository {
    constructor(private secureToken: string) {}

    sendFile(from: string, to: string, subject: string, body: string, file: File): FutureData<void> {
        const secureToken = this.secureToken;
        return Future.fromComputation((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsBinaryString(file);
            reader.onload = function () {
                const dataUri = "data:" + file.type + ";base64," + btoa(reader.result as string);
                (window as any).Email.send({
                    SecureToken: secureToken,
                    From: from,
                    To: to,
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

    send(from: string, to: string, subject: string, body: string, replyAddress?: string): FutureData<void> {
        return Future.fromComputation((resolve, reject) => {
            (window as any).Email.send({
                SecureToken: this.secureToken,
                From: from,
                To: to,
                ReplyAddress: replyAddress,
                Subject: subject,
                Body: body,
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

            return () => {};
        });
    }
}
