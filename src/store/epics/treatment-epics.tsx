import { ActionsObservable } from "redux-observable";
import { ActionType } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import * as ajax from "../../store/ajax";
import { of } from "rxjs";
import { catchError, mergeMap, switchMap } from "rxjs/operators";
import { AjaxError } from "rxjs/ajax";
import { TreatmentResponse } from "../../types/Treatment";
import {
  fetchTreatmentStudiesError,
  fetchTreatmentStudiesRequest,
  fetchTreatmentStudiesSuccess,
  setMolecularMarker,
  setTreatmentDrug,
  setTreatmentMapType,
  setTreatmentPlasmodiumSpecies
} from "../actions/treatment-actions";
import { MapServerConfig } from "../../constants/constants";

interface Params {
  [key: string]: string | number | boolean;
}

export const getTreatmentStudiesEpic = (
  action$: ActionsObservable<ActionType<typeof fetchTreatmentStudiesRequest>>
) =>
  action$.ofType(ActionTypeEnum.FetchTreatmentStudiesRequest).pipe(
    switchMap(() => {
      const params: Params = {
        f: "json",
        where: `YEAR_START >= ${MapServerConfig.years.from} AND YEAR_START <= ${MapServerConfig.years.to}`,
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

export const setTreatmentThemeEpic = (
  action$: ActionsObservable<ActionType<typeof setTreatmentMapType>>
) =>
  action$.ofType(ActionTypeEnum.SetTreatmentMapType).pipe(
    switchMap(action => {
      if (action.payload === 2) {
        return of(setMolecularMarker(0));
      }
      return of();
    })
  );

export const setPlasmodiumSpeciesEpic = (
  action$: ActionsObservable<ActionType<typeof setTreatmentPlasmodiumSpecies>>
) =>
  action$.ofType(ActionTypeEnum.SetPlasmodiumSpecies).pipe(
    switchMap(action => {
      if (action.payload === "P._FALCIPARUM") {
        return of(setTreatmentDrug("DRUG_AL"));
      } else if (action.payload === "P._VIVAX") {
        return of(setTreatmentDrug("DRUG_CQ"));
      }
      return of();
    })
  );
