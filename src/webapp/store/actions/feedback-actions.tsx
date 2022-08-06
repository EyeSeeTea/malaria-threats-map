import { createAction } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import { FeedbackData } from "../../../domain/entities/Feedback";
import { FieldErrorsState } from "../../types/FeedbackState";

export type ChangedField = { prop: keyof FeedbackData; value: string };

export const feedbackFieldChange = createAction(ActionTypeEnum.FeedbackFieldChange)<ChangedField>();

export const feedbackSetFields = createAction(ActionTypeEnum.FeedbackSetFields)<FeedbackData>();

export const feedbackSetFieldErrors = createAction(ActionTypeEnum.FeedbackSetFieldErros)<FieldErrorsState>();

export const feedbackSubmit = createAction(ActionTypeEnum.FeedbackSubmit)();

export const feedbackSuccess = createAction(ActionTypeEnum.FeedbackSuccess)();

export const feedbackError = createAction(ActionTypeEnum.FeedbackError)();
