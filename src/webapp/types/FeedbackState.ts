import { FeedbackData } from "../../domain/entities/Feedback";

export type FieldErrorsState = Partial<Record<keyof FeedbackData, string>>;

export interface FeedbackState {
    fields: FeedbackData;
    fieldErrors: FieldErrorsState;
    submitting: boolean;
    message?: { type: "error" | "success"; text: string };
}
