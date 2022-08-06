import { FutureData } from "../common/FutureData";
import { Feedback } from "../entities/Feedback";
import { EmailRepository } from "../repositories/EmailRepository";

export class SendFeedbackUseCase {
    constructor(
        private emailRepository: EmailRepository,
        private feedbackEmailFrom: string,
        private feedbackEmailTo: string
    ) {}

    execute(feedback: Feedback): FutureData<void> {
        const body = `Name: ${feedback.name}<br/>Message: ${feedback.message}`;
        return this.emailRepository.send(
            this.feedbackEmailFrom,
            this.feedbackEmailTo,
            feedback.subject,
            body,
            feedback.email
        );
    }
}
