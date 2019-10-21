import { ActionsObservable } from "redux-observable";
import { ActionType } from "typesafe-actions";
import { ActionTypeEnum } from "../../store/actions";
import * as ajax from "../../store/ajax";
import { of } from "rxjs";
import { catchError, mergeMap, switchMap } from "rxjs/operators";
import { AjaxError } from "rxjs/ajax";
import { PreventionResponse } from "../../types/Prevention";
import { MapServerConfig } from "../../constants/constants";
import {
  fetchPreventionStudiesError,
  fetchPreventionStudiesRequest,
  fetchPreventionStudiesSuccess,
  setPreventionMapType,
  setType
} from "../actions/prevention-actions";
import { PreventionMapType } from "../types";

interface Params {
  [key: string]: string | number | boolean;
}

export const getPreventionStudiesEpic = (
  action$: ActionsObservable<ActionType<typeof fetchPreventionStudiesRequest>>
) =>
  action$.ofType(ActionTypeEnum.FetchPreventionStudiesRequest).pipe(
    switchMap(() => {
      const params: Params = {
        f: "json",
        where: `YEAR_START >= ${MapServerConfig.years.from} AND YEAR_START <= ${MapServerConfig.years.to}`,
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
        .get(`/${MapServerConfig.layers.prevention}/query?${query}`)
        .pipe(
          mergeMap((response: PreventionResponse) => {
            return of(fetchPreventionStudiesSuccess(response));
          }),
          catchError((error: AjaxError) =>
            of(fetchPreventionStudiesError(error))
          )
        );
    })
  );

export const setPreventionMapTypeEpic = (
  action$: ActionsObservable<ActionType<typeof setPreventionMapType>>
) =>
  action$.ofType(ActionTypeEnum.SetPreventionMapType).pipe(
    switchMap(action => {
      if (action.payload === PreventionMapType.RESISTANCE_MECHANISM) {
        return of(setType("MONO_OXYGENASES"));
      }
      return of(setType(undefined));
    })
  );
