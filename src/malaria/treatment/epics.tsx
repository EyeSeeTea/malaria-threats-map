import { ActionsObservable } from "redux-observable";
import { ActionType } from "typesafe-actions";
import { ActionTypeEnum } from "../../store/actions";
import * as ajax from "../../store/ajax";
import { of } from "rxjs";
import {
  fetchTreatmentStudiesError,
  fetchTreatmentStudiesRequest,
  fetchTreatmentStudiesSuccess
} from "./actions";
import { switchMap, mergeMap, catchError } from "rxjs/operators";
import { AjaxError } from "rxjs/ajax";
import { TreatmentResponse } from "../../types/Treatment";
import { MapServerConfig } from "../constants";

interface Params {
  [key: string]: string | number | boolean;
}

export const getTreatmentStudiesEpic = (
  action$: ActionsObservable<ActionType<typeof fetchTreatmentStudiesRequest>>
) =>
  action$.ofType(ActionTypeEnum.FetchTreatmentStudiesRequest).pipe(
    switchMap(action => {
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
        .get(`/${MapServerConfig.layers.treatment}/query?${query}`)
        .pipe(
          mergeMap((response: TreatmentResponse) => {
            return of(fetchTreatmentStudiesSuccess(response));
          }),
          catchError((error: AjaxError) =>
            of(fetchTreatmentStudiesError(error))
          )
        );
    })
  );
