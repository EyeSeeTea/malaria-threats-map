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
  fetchInvasiveStudiesSuccess,
  setInvasiveMapType,
} from "../actions/invasive-actions";
import { MapServerConfig } from "../../constants/constants";
import {
  setFiltersAction,
  setThemeAction,
  logPageViewAction
} from "../actions/base-actions";
import { InvasiveMapType } from "../types";
import { addNotificationAction } from "../actions/notifier-actions";
import { ErrorResponse } from "../../types/Malaria";
import { getAnalyticsPageView } from "../analytics";

interface Params {
  [key: string]: string | number | boolean;
}

type Response = InvasiveResponse & ErrorResponse;

export const getInvasiveStudiesEpic = (
  action$: ActionsObservable<ActionType<typeof fetchInvasiveStudiesRequest>>
) =>
  action$.ofType(ActionTypeEnum.FetchInvasiveStudiesRequest).pipe(
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
        .get(`/${MapServerConfig.layers.invasive}/query?${query}`)
        .pipe(
          mergeMap((response: Response) => {
            if (response.error) {
              return of(
                addNotificationAction(response.error.message),
                fetchInvasiveStudiesError(response.error.message)
              );
            } else {
              return of(fetchInvasiveStudiesSuccess(response));
            }
          }),
          catchError((error: AjaxError) =>
            of(
              addNotificationAction(error.message),
              fetchInvasiveStudiesError(error)
            )
          )
        );
    })
  );

export const setTreatmentMapTypeEpic = (
  action$: ActionsObservable<ActionType<typeof setInvasiveMapType>>
) =>
  action$.ofType(ActionTypeEnum.SetInvasiveMapType).pipe(
    switchMap(action => {
      const pageView = getAnalyticsPageView({ page: "invasive", section: action.payload });
      const logPageView = logPageViewAction(pageView);
      if (action.payload === InvasiveMapType.VECTOR_OCCURANCE) {
        return of(logPageView);
      }
      return of();
    })
  );

export const setInvasiveThemeEpic = (
  action$: ActionsObservable<ActionType<typeof setThemeAction>>
) =>
  action$.ofType(ActionTypeEnum.MalariaSetTheme).pipe(
    switchMap($action => {
      if ($action.payload !== "invasive") {
        return of();
      }
      return of(setFiltersAction([1985, new Date().getFullYear()]));
    })
  );
