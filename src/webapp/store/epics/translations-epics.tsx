import { ActionType } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import * as ajax from "../../store/ajax";
import { Observable, of } from "rxjs";
import { catchError, mergeMap, switchMap } from "rxjs/operators";
import { AjaxError } from "rxjs/ajax";
import { TranslationResponse, TranslationXMartResponse } from "../../types/Translation";
import {
    fetchTranslationsErrorAction,
    fetchTranslationsRequestAction,
    fetchTranslationsSuccessAction,
} from "../actions/translations-actions";
import { ofType } from "redux-observable";

export const getTranslationsEpic = (action$: Observable<ActionType<typeof fetchTranslationsRequestAction>>) =>
    action$.pipe(
        ofType(ActionTypeEnum.FetchTranslationsRequest),
        switchMap(() => {
            return ajax
                .getUrl<TranslationXMartResponse>(
                    "https://frontdoor-r5quteqglawbs.azurefd.net/TRAINING_EYESEETEA/MTM_TRADS?$top=99996"
                )
                .pipe(
                    mergeMap((response: TranslationXMartResponse) => {
                        const oldResponse = {
                            displayFieldName: "",
                            fields: [],
                            fieldAliases: [],
                            features: response.value.map(v => ({ attributes: v })),
                        } as TranslationResponse;

                        return of(fetchTranslationsSuccessAction(oldResponse));
                    }),
                    catchError((error: AjaxError) => of(fetchTranslationsErrorAction(error)))
                );
        })
    );
