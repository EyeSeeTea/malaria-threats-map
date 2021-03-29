import { ActionsObservable } from "redux-observable";
import { ActionType } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import * as ajax from "../../store/ajax";
import { of } from "rxjs";
import { catchError, mergeMap, switchMap } from "rxjs/operators";
import { AjaxError } from "rxjs/ajax";
import { TranslationResponse } from "../../types/Translation";
import { MapServerConfig } from "../../constants/constants";
import {
  fetchTranslationsErrorAction,
  fetchTranslationsRequestAction,
  fetchTranslationsSuccessAction,
} from "../actions/translations-actions";

interface Params {
  [key: string]: string | number | boolean;
}

export const getTreatmentStudiesEpic = (
  action$: ActionsObservable<ActionType<typeof fetchTranslationsRequestAction>>
) =>
  action$.ofType(ActionTypeEnum.FetchTranslationsRequest).pipe(
    switchMap(() => {
      const params: Params = {
        f: "json",
        where: "1%3D1",
        outFields: "*",
      };
      const query: string = Object.keys(params)
        .map((key) => `${key}=${params[key]}`)
        .join("&");
      return ajax
        .get(`/${MapServerConfig.layers.translations}/query?${query}`)
        .pipe(
          mergeMap((response: TranslationResponse) => {
            return of(fetchTranslationsSuccessAction(response));
          }),
          catchError((error: AjaxError) =>
            of(fetchTranslationsErrorAction(error))
          )
        );
    })
  );
