import { ActionsObservable, StateObservable } from "redux-observable";
import { ActionType } from "typesafe-actions";
import { ActionTypeEnum } from "../../store/actions";
import * as ajax from "../../store/ajax";
import { of } from "rxjs";
import {
  catchError,
  mergeMap,
  skip,
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
  setDiagnosisDeletionType,
  setDiagnosisMapType,
  setDiagnosisPatientType,
  setDiagnosisSurveyTypes
} from "../actions/diagnosis-actions";
import {
  logEventAction,
  setFiltersAction,
  setThemeAction
} from "../actions/base-actions";
import { DiagnosisMapType, State } from "../types";
import { addNotificationAction } from "../actions/notifier-actions";
import { ErrorResponse } from "../../types/Malaria";

interface Params {
  [key: string]: string | number | boolean;
}

type Response = DiagnosisResponse & ErrorResponse;

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
          mergeMap((response: Response) => {
            if (response.error) {
              return of(
                addNotificationAction(response.error.message),
                fetchDiagnosisStudiesError(response.error.message)
              );
            } else {
              return of(fetchDiagnosisStudiesSuccess(response));
            }
          }),
          catchError((error: AjaxError) =>
            of(
              addNotificationAction(error.message),
              fetchDiagnosisStudiesError(error)
            )
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

export const setDiagnosisMapTypeEpic = (
  action$: ActionsObservable<ActionType<typeof setDiagnosisMapType>>
) =>
  action$.ofType(ActionTypeEnum.SetDiagnosisMapType).pipe(
    switchMap(action => {
      const log = (type: string) =>
        logEventAction({
          category: "Diagnosis Map Type",
          action: type
        });
      if (action.payload === DiagnosisMapType.GENE_DELETIONS) {
        return of(log("pfhrp2/3 gene deletions"));
      }
      return of();
    })
  );

export const setDiagnosisSurveyTypesEpic = (
  action$: ActionsObservable<ActionType<typeof setDiagnosisSurveyTypes>>
) =>
  action$
    .ofType(ActionTypeEnum.SetSurveyTypes)
    .pipe(skip(1))
    .pipe(
      switchMap(action => {
        const actions: any[] = [];
        (action.payload || []).forEach(surveyType =>
          actions.push(
            logEventAction({
              category: "Survey Type",
              action: surveyType
            })
          )
        );
        return of(...actions);
      })
    );

export const setDiagnosisPatientTypeEpic = (
  action$: ActionsObservable<ActionType<typeof setDiagnosisPatientType>>
) =>
  action$
    .ofType(ActionTypeEnum.SetPatientType)
    .pipe(skip(1))
    .pipe(
      switchMap(action => {
        return of(
          logEventAction({
            category: "Patient Type",
            action: action.payload
          })
        );
      })
    );

export const setDiagnosisDeletionTypeEpic = (
  action$: ActionsObservable<ActionType<typeof setDiagnosisDeletionType>>
) =>
  action$
    .ofType(ActionTypeEnum.SetDeletionType)
    .pipe(skip(1))
    .pipe(
      switchMap(action => {
        return of(
          logEventAction({
            category: "Deletion Type",
            action: action.payload
          })
        );
      })
    );
