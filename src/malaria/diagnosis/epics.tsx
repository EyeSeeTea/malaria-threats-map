import { ActionsObservable } from "redux-observable";
import { ActionType } from "typesafe-actions";
import { ActionTypeEnum } from "../../store/actions";
import * as ajax from "../../store/ajax";
import { of } from "rxjs";
import {
  fetchDiagnosisStudiesError,
  fetchDiagnosisStudiesRequest,
  fetchDiagnosisStudiesSuccess
} from "./actions";
import { switchMap, mergeMap, catchError } from "rxjs/operators";
import { AjaxError } from "rxjs/ajax";
import { DiagnosisResponse } from "../../types/Diagnosis";
import { MapServerConfig } from "../constants";

interface Params {
  [key: string]: string | number | boolean;
}

export const getDiagnosisStudiesEpic = (
  action$: ActionsObservable<ActionType<typeof fetchDiagnosisStudiesRequest>>
) =>
  action$.ofType(ActionTypeEnum.FetchDiagnosisStudiesRequest).pipe(
    switchMap(action => {
      const params: Params = {
        f: "json",
        where: `YEAR_START >= ${MapServerConfig.years.from} AND YEAR_START <= ${MapServerConfig.years.to}`,
        returnGeometry: false,
        spatialRel: "esriSpatialRelIntersects",
        outFields: "OBJECTID,Latitude,Longitude",
        resultOffset: 0,
        resultRecordCount: 25000
      };
      const query: string = Object.keys(params)
        .map(key => `${key}=${params[key]}`)
        .join("&");
      return ajax
        .get(`/${MapServerConfig.layers.diagnosis}/query?${query}`)
        .pipe(
          mergeMap((response: DiagnosisResponse) => {
            return of(fetchDiagnosisStudiesSuccess(response));
          }),
          catchError((error: AjaxError) =>
            of(fetchDiagnosisStudiesError(error))
          )
        );
    })
  );
