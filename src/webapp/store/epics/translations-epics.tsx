import { ActionType } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import * as ajax from "../../store/ajax";
import { Observable, of } from "rxjs";
import { catchError, mergeMap, switchMap } from "rxjs/operators";
import { AjaxError } from "rxjs/ajax";
import { TranslationResponse, Translation } from "../../types/Translation";
import { XMartApiResponse } from "../../../data/common/types";
import {
    fetchTranslationsErrorAction,
    fetchTranslationsRequestAction,
    fetchTranslationsSuccessAction,
} from "../actions/translations-actions";
import { ofType } from "redux-observable";
import config from "../../config";

export const getTranslationsEpic = (action$: Observable<ActionType<typeof fetchTranslationsRequestAction>>) =>
    action$.pipe(
        ofType(ActionTypeEnum.FetchTranslationsRequest),
        switchMap(() => {
            return ajax.getUrl<XMartApiResponse<Translation>>(config.xmartServerUrl + "/TRANSLATIONS").pipe(
                mergeMap((response: XMartApiResponse<Translation>) => {
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
