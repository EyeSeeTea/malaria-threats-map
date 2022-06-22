import { ofType, StateObservable } from "redux-observable";
import { ActionType } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import { Observable, of } from "rxjs";
import { catchError, mergeMap, switchMap, withLatestFrom } from "rxjs/operators";
import { State } from "../types";
import { fromFuture } from "./utils";
import { EpicDependencies } from "../index";
import { Feedback, FeedbackData } from "../../../domain/entities/Feedback";
import {
    feedbackError,
    feedbackSetFieldErrors,
    feedbackFieldChange,
    feedbackSubmit,
    feedbackSuccess,
    feedbackSetFields,
} from "../actions/feedback-actions";
import { validationErrorMessages, ValidationErrors } from "../../../domain/types/Errors";
import { FieldErrorsState } from "../../types/FeedbackState";

function mapErrors(validationErrors: ValidationErrors<FeedbackData>): FieldErrorsState {
    return Object.keys(validationErrors).reduce((acc, key) => {
        return {
            ...acc,
            [key]: validationErrors[key as keyof FeedbackData]
                .map(error => validationErrorMessages[error](key))
                .join("\n"),
        };
    }, {});
}

export const feedbackFieldChangeEpic = (
    action$: Observable<ActionType<typeof feedbackFieldChange>>,
    state$: StateObservable<State>
) =>
    action$.pipe(
        ofType(ActionTypeEnum.FeedbackFieldChange),
        withLatestFrom(state$),
        switchMap(([action, state]) => {
            const data = { ...state.feedback.fields, [action.payload.prop]: action.payload.value };
            const feedback = Feedback.create(data);

            return feedback.fold(
                validationErrors => {
                    const errors = mapErrors(validationErrors);

                    return of(
                        feedbackSetFields(data),
                        feedbackSetFieldErrors({
                            ...state.feedback.fieldErrors,
                            [action.payload.prop]: errors[action.payload.prop],
                        })
                    );
                },
                () => {
                    return of(
                        feedbackSetFields(data),
                        feedbackSetFieldErrors({
                            ...state.feedback.fieldErrors,
                            [action.payload.prop]: undefined,
                        })
                    );
                }
            );
        })
    );

export const feedbackSubmitEpic = (
    action$: Observable<ActionType<typeof feedbackSubmit>>,
    state$: StateObservable<State>,
    { compositionRoot }: EpicDependencies
) =>
    action$.pipe(
        ofType(ActionTypeEnum.FeedbackSubmit),
        withLatestFrom(state$),
        switchMap(([, state]) => {
            const feedback = Feedback.create(state.feedback.fields);

            if (feedback.isLeft()) {
                const errors = mapErrors(feedback.getLeft());

                return of(feedbackSetFieldErrors(errors));
            } else {
                return fromFuture(compositionRoot.feedback.send(feedback.get())).pipe(
                    mergeMap(() => of(feedbackSuccess())),
                    catchError(() => of(feedbackError()))
                );
            }
        })
    );
