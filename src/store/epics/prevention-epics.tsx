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
  setAssayTypes,
  setPreventionMapType,
  setType
} from "../actions/prevention-actions";
import { PreventionMapType } from "../types";
import { setCountryModeAction } from "../actions/base-actions";
import { ASSAY_TYPES } from "../../components/filters/AssayTypeCheckboxFilter";

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
        where: `YEAR_START >= ${MapServerConfig.years.from} AND YEAR_START <= ${
          MapServerConfig.years.to
        }`,
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
      } else if (action.payload === PreventionMapType.PBO_DEPLOYMENT) {
        return of(setCountryModeAction(false));
      }
      return of(setType(undefined));
    })
  );

export const setPreventionTypeEpic = (
  action$: ActionsObservable<ActionType<typeof setType>>
) =>
  action$.ofType(ActionTypeEnum.SetType).pipe(
    switchMap(action => {
      const kdr = ["KDR_L1014S", "KDR_L1014F", "KDR_(MUTATION_UNSPECIFIED)"];
      if (kdr.includes(action.payload)) {
        return of(setAssayTypes([ASSAY_TYPES[0]]));
      } else if (["ACE1R"].includes(action.payload)) {
        return of(setAssayTypes([ASSAY_TYPES[0], ASSAY_TYPES[1]]));
      } else {
        return of(setAssayTypes(ASSAY_TYPES));
      }
    })
  );
