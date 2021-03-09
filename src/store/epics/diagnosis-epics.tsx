import { ActionsObservable } from "redux-observable";
import { ActionType } from "typesafe-actions";
import { ActionTypeEnum } from "../../store/actions";
import * as ajax from "../../store/ajax";
import { of } from "rxjs";
import { catchError, mergeMap, skip, switchMap } from "rxjs/operators";
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
  setThemeAction,
  logPageViewAction
} from "../actions/base-actions";
import { DiagnosisMapType } from "../types";
import { addNotificationAction } from "../actions/notifier-actions";
import { ErrorResponse } from "../../types/Malaria";
import { getAnalyticsPageView } from "../analytics";

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
        where: `1%3D1`,
        outFields: "*"
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

export const setDiagnosisThemeEpic = (
  action$: ActionsObservable<ActionType<typeof setThemeAction>>
) =>
  action$.ofType(ActionTypeEnum.MalariaSetTheme).pipe(
    switchMap($action => {
      if ($action.payload !== "diagnosis") {
        return of();
      }
      return of(setFiltersAction([1998, new Date().getFullYear()]));
    })
  );

export const setDiagnosisMapTypeEpic = (
  action$: ActionsObservable<ActionType<typeof setDiagnosisMapType>>
) =>
  action$.ofType(ActionTypeEnum.SetDiagnosisMapType).pipe(
    switchMap(action => {
      const pageView = getAnalyticsPageView({ page: "diagnosis", section: action.payload });
      const logPageView = logPageViewAction(pageView);
  
      if (action.payload === DiagnosisMapType.GENE_DELETIONS) {
        return of(logPageView);
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
              category: "filter",
              action: "surveyType",
              label: surveyType
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
            category: "filter",
            action: "patient",
            label: action.payload
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
            category: "filter",
            action: "deletionType",
            label: action.payload
          })
        );
      })
    );
