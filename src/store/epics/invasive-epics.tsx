import { ActionsObservable } from "redux-observable";
import { ActionType } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import * as ajax from "../../store/ajax";
import { of } from "rxjs";
import { catchError, mergeMap, switchMap } from "rxjs/operators";
import { AjaxError } from "rxjs/ajax";
import { InvasiveResponse } from "../../types/Invasive";
import {
  fetchInvasiveStudiesError,
  fetchInvasiveStudiesRequest,
  fetchInvasiveStudiesSuccess
} from "../actions/invasive-actions";
import { MapServerConfig } from "../../constants/constants";

interface Params {
  [key: string]: string | number | boolean;
}

export const getInvasiveStudiesEpic = (
  action$: ActionsObservable<ActionType<typeof fetchInvasiveStudiesRequest>>
) =>
  action$.ofType(ActionTypeEnum.FetchInvasiveStudiesRequest).pipe(
    switchMap(() => {
      const params: Params = {
        f: "json",
        where: `YEAR_START >= ${MapServerConfig.years.from} AND YEAR_START <= ${
          MapServerConfig.years.to
        }`,
        returnGeometry: false,
        spatialRel: "esriSpatialRelIntersects",
        outFields: "OBJECTID,Latitude,Longitude,YEAR_START",
        resultOffset: 0,
        resultRecordCount: 25000
      };
      const query: string = Object.keys(params)
        .map(key => `${key}=${params[key]}`)
        .join("&");
      return ajax
        .get(`/${MapServerConfig.layers.invasive}/query?${query}`)
        .pipe(
          mergeMap((response: InvasiveResponse) => {
            return of(fetchInvasiveStudiesSuccess(response));
          }),
          catchError((error: AjaxError) => of(fetchInvasiveStudiesError(error)))
        );
    })
  );
