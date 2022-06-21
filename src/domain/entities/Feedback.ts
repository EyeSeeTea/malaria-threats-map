import { Either } from "../types/Either";
import { ValidationError } from "../types/Errors";
import { validateRegexp, validateRequired } from "../utils/validations";

const EMAIL_PATTERN =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export interface FeedbackData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export class Feedback {
    public readonly name: string;
    public readonly email: string;
    public readonly subject: string;
    public readonly message: string;

    private constructor(data: FeedbackData) {
        this.name = data.name;
        this.email = data.email;
        this.subject = data.subject;
        this.message = data.message;
    }

    public static create(data: FeedbackData): Either<ValidationError<FeedbackData>[], Feedback> {
        return this.validateAndCreate(data);
    }

    public toData(): FeedbackData {
        return { name: this.name, email: this.email, subject: this.subject, message: this.message };
    }

    private static validateAndCreate(data: FeedbackData): Either<ValidationError<FeedbackData>[], Feedback> {
        const emailRequiredError = validateRequired(data.email);

        const errors = [
            { property: "name" as const, errors: validateRequired(data.name), value: data.name },
            {
                property: "email" as const,
                errors: emailRequiredError.length > 0 ? emailRequiredError : validateRegexp(data.email, EMAIL_PATTERN),
                value: data.email,
            },
            { property: "subject" as const, errors: validateRequired(data.subject), value: data.subject },
            { property: "message" as const, errors: validateRequired(data.message), value: data.message },
        ].filter(validation => validation.errors.length > 0);

        if (errors.length === 0) {
            return Either.right(
                new Feedback({
                    name: data.name,
                    email: data.email,
                    subject: data.subject,
                    message: data.message,
                })
            );
        } else {
            return Either.left(errors);
        }
    }
}
