import { ActionType } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import * as ajax from "../../store/ajax";
import { Observable, of } from "rxjs";
import { catchError, mergeMap, switchMap } from "rxjs/operators";
import { AjaxError } from "rxjs/ajax";
import { TranslationResponse } from "../../types/Translation";
import { MapServerConfig } from "../../constants/constants";
import {
    fetchTranslationsErrorAction,
    fetchTranslationsRequestAction,
    fetchTranslationsSuccessAction,
} from "../actions/translations-actions";
import { ApiParams } from "../../../data/common/types";
import { ofType } from "redux-observable";

export const getTreatmentStudiesEpic = (action$: Observable<ActionType<typeof fetchTranslationsRequestAction>>) =>
    action$.pipe(
        ofType(ActionTypeEnum.FetchTranslationsRequest),
        switchMap(() => {
            const params: ApiParams = {
                f: "json",
                where: "1%3D1",
                outFields: "*",
            };
            const query: string = Object.keys(params)
                .map(key => `${key}=${params[key]}`)
                .join("&");
            return ajax.get<TranslationResponse>(`/${MapServerConfig.layers.translations}/query?${query}`).pipe(
                mergeMap((response: TranslationResponse) => {
                    return of(fetchTranslationsSuccessAction(response));
                }),
                catchError((error: AjaxError) => of(fetchTranslationsErrorAction(error)))
            );
        })
    );
