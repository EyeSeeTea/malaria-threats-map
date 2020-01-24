import { ActionsObservable } from "redux-observable";
import { ActionType } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import * as ajax from "../../store/ajax";
import { of } from "rxjs";
import { catchError, mergeMap, skip, switchMap } from "rxjs/operators";
import { AjaxError } from "rxjs/ajax";
import { InvasiveResponse } from "../../types/Invasive";
import {
  fetchInvasiveStudiesError,
  fetchInvasiveStudiesRequest,
  fetchInvasiveStudiesSuccess,
  setInvasiveMapType,
  setInvasiveVectorSpecies
} from "../actions/invasive-actions";
import { MapServerConfig } from "../../constants/constants";
import { logEventAction } from "../actions/base-actions";
import { InvasiveMapType } from "../types";
import { addNotificationAction } from "../actions/notifier-actions";
import { ErrorResponse } from "../../types/Malaria";

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
        where: `1=1`,
        returnGeometry: false,
        spatialRel: "esriSpatialRelIntersects",
        outFields: "*",
        resultOffset: 0,
        resultRecordCount: 50000
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
      const log = (type: string) =>
        logEventAction({
          category: "Invasive Map Type",
          action: type
        });
      if (action.payload === InvasiveMapType.VECTOR_OCCURANCE) {
        return of(log("Vector occurance"));
      }
      return of();
    })
  );

export const setInvasiveVectorSpeciesEpic = (
  action$: ActionsObservable<ActionType<typeof setInvasiveVectorSpecies>>
) =>
  action$
    .ofType(ActionTypeEnum.SetInvasiveVectorSpecies)
    .pipe(skip(1))
    .pipe(
      switchMap(action => {
        const actions: any[] = [];
        (action.payload || []).forEach(species =>
          actions.push(
            logEventAction({
              category: "Vector Species",
              action: species
            })
          )
        );
        return of(...actions);
      })
    );
