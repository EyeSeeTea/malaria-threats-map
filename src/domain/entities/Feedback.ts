import { Either } from "../types/Either";
import { ValidationErrors } from "../types/Errors";
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

    public static create(data: FeedbackData): Either<ValidationErrors<FeedbackData>, Feedback> {
        return this.validateAndCreate(data);
    }

    public toData(): FeedbackData {
        return { name: this.name, email: this.email, subject: this.subject, message: this.message };
    }

    private static validateAndCreate(data: FeedbackData): Either<ValidationErrors<FeedbackData>, Feedback> {
        const emailRequiredError = validateRequired(data.email);

        const errors = {
            name: validateRequired(data.name),
            email: emailRequiredError.length > 0 ? emailRequiredError : validateRegexp(data.email, EMAIL_PATTERN),
            subject: validateRequired(data.subject),
            message: validateRequired(data.message),
        };

        const propsWithErrors = Object.keys(errors).filter(prop => errors[prop as keyof FeedbackData].length !== 0);

        if (propsWithErrors.length === 0) {
            return Either.right(
                new Feedback({
                    name: data.name,
                    email: data.email,
                    subject: data.subject,
                    message: data.message,
                })
            );
        } else {
            const finalErrors = Object.keys(errors).reduce((acc, key) => {
                return errors[key as keyof FeedbackData].length > 0
                    ? {
                          ...acc,
                          [key]: errors[key as keyof FeedbackData],
                      }
                    : acc;
            }, {});

            return Either.left(finalErrors);
        }
    }
}
