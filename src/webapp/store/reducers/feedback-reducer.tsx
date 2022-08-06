import { ActionTypeEnum } from "../actions";
import { createReducer } from "../reducer-utils";
import { createSelector } from "reselect";
import { State } from "../types";
import { FeedbackState, FieldErrorsState } from "../../types/FeedbackState";
import { FeedbackData } from "../../../domain/entities/Feedback";

const initialState: FeedbackState = Object.freeze({
    fields: { name: "", email: "", subject: "", message: "" },
    fieldErrors: { name: "", email: "", subject: "", message: "" },
    submitting: false,
    message: undefined,
});

export default createReducer<FeedbackState>(initialState, {
    [ActionTypeEnum.FeedbackSetFields]: (data: FeedbackData) => (state: FeedbackState) => ({ ...state, fields: data }),
    [ActionTypeEnum.FeedbackSetFieldErros]: (errors: FieldErrorsState) => (state: FeedbackState) => ({
        ...state,
        fieldErrors: errors,
    }),
    [ActionTypeEnum.FeedbackSubmit]: () => (state: FeedbackState) => ({
        ...state,
        submitting: true,
    }),
    [ActionTypeEnum.FeedbackSuccess]: () => (state: FeedbackState) => ({
        ...state,
        message: { type: "success" as const, text: "Feedback sent successfully" },
    }),
    [ActionTypeEnum.FeedbackError]: () => (state: FeedbackState) => ({
        ...state,
        message: { type: "error" as const, text: "An error has ocurred sending the feedback, please try later again" },
    }),
});

const selectFeedbackState = (state: State) => state.feedback;

export const selectFeedback = createSelector(selectFeedbackState, state => state);
