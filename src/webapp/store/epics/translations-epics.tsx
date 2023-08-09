import { ActionType } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import { Observable, of } from "rxjs";
import { catchError, mergeMap, switchMap, withLatestFrom } from "rxjs/operators";
import { TranslationResponse, Translation } from "../../types/Translation";

import {
    fetchTranslationsErrorAction,
    fetchTranslationsRequestAction,
    fetchTranslationsSuccessAction,
} from "../actions/translations-actions";
import { ofType, StateObservable } from "redux-observable";
import { State } from "../types";
import { EpicDependencies } from "..";
import { fromFuture } from "./utils";
import { addNotificationAction } from "../actions/notifier-actions";

export const getTranslationsEpic = (
    action$: Observable<ActionType<typeof fetchTranslationsRequestAction>>,
    state$: StateObservable<State>,
    { compositionRoot }: EpicDependencies
) =>
    action$.pipe(
        ofType(ActionTypeEnum.FetchTranslationsRequest),
        withLatestFrom(state$),
        switchMap(([, state]) => {
            if (state.translations.translations.length === 0) {
                return fromFuture(compositionRoot.translations.get()).pipe(
                    mergeMap((translations: Translation[]) => {
                        //TODO: remove old feature structure from translations when they are retrueved from ArgGis
                        const oldResponse = mapToOldArgisStructure(translations);

                        return of(fetchTranslationsSuccessAction(oldResponse));
                    }),
                    catchError((error: Error) =>
                        of(addNotificationAction(error.message),fetchTranslationsErrorAction())
                    )
                );
            } else {
                //TODO: remove old feature structure from translations when they are retrueved from ArgGis
                const oldResponse = mapToOldArgisStructure(state.translations.translations);

                return of(fetchTranslationsSuccessAction(oldResponse));
            }
        })
    );

function mapToOldArgisStructure(translations: Translation[]) {
    return {
        displayFieldName: "",
        fields: [],
        fieldAliases: [],
        features: translations.map(v => ({ attributes: v })),
    } as TranslationResponse;
}
