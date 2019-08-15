import { ActionsObservable } from "redux-observable";
import { ActionType } from "typesafe-actions";
import { ActionTypeEnum } from "../../store/actions";
import * as ajax from "../../store/ajax";
import { of } from "rxjs";
import {
  fetchTranslationsErrorAction,
  fetchTranslationsSuccessAction,
  fetchTranslationsRequestAction
} from "./actions";
import { catchError, mergeMap, switchMap } from "rxjs/operators";
import { AjaxError } from "rxjs/ajax";
import { MapServerConfig } from "../constants";
import { TranslationResponse } from "../../types/Translation";

interface Params {
  [key: string]: string | number | boolean;
}

export const getTreatmentStudiesEpic = (
  action$: ActionsObservable<ActionType<typeof fetchTranslationsRequestAction>>
) =>
  action$.ofType(ActionTypeEnum.FetchTranslationsRequest).pipe(
    switchMap(action => {
      const params: Params = {
        f: "json",
        where: "1=1",
        returnGeometry: false,
        spatialRel: "esriSpatialRelIntersects",
        outFields: "*",
        resultOffset: 0,
        resultRecordCount: 25000
      };
      const query: string = Object.keys(params)
        .map(key => `${key}=${params[key]}`)
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
