import { ActionsObservable, StateObservable } from "redux-observable";
import { ActionType } from "typesafe-actions";
import { ActionTypeEnum } from "../../store/actions";
import * as ajax from "../../store/ajax";
import { of } from "rxjs";
import {
  catchError,
  mergeMap,
  switchMap,
  withLatestFrom
} from "rxjs/operators";
import { AjaxError } from "rxjs/ajax";
import { DiagnosisResponse } from "../../types/Diagnosis";
import { MapServerConfig } from "../../constants/constants";
import {
  fetchDiagnosisStudiesError,
  fetchDiagnosisStudiesRequest,
  fetchDiagnosisStudiesSuccess,
  setDiagnosisMapType
} from "../actions/diagnosis-actions";
import {
  setFiltersAction,
  setStoryModeAction,
  setStoryModeStepAction,
  setThemeAction
} from "../actions/base-actions";
import { State } from "../types";

interface Params {
  [key: string]: string | number | boolean;
}

export const getDiagnosisStudiesEpic = (
  action$: ActionsObservable<ActionType<typeof fetchDiagnosisStudiesRequest>>
) =>
  action$.ofType(ActionTypeEnum.FetchDiagnosisStudiesRequest).pipe(
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

export const setStoryModeStepEpic = (
  action$: ActionsObservable<
    ActionType<typeof setDiagnosisMapType | typeof setThemeAction>
  >,
  state$: StateObservable<State>
) =>
  action$
    .ofType(ActionTypeEnum.SetDiagnosisMapType, ActionTypeEnum.MalariaSetTheme)
    .pipe(
      withLatestFrom(state$),
      switchMap(([_, state]) => {
        if (state.malaria.filters[0] < 1998) {
          return of(setFiltersAction([1998, state.malaria.filters[1]]));
        } else {
          return of();
        }
      })
    );
