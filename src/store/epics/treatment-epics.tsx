import { ActionsObservable } from "redux-observable";
import { ActionType } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import * as ajax from "../../store/ajax";
import { of } from "rxjs";
import { catchError, mergeMap, skip, switchMap } from "rxjs/operators";
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
import { logEventAction } from "../actions/base-actions";
import { TreatmentMapType } from "../types";
import { MOLECULAR_MARKERS } from "../../components/filters/MolecularMarkerFilter";

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

export const setTreatmentMapTypeEpic = (
  action$: ActionsObservable<ActionType<typeof setTreatmentMapType>>
) =>
  action$.ofType(ActionTypeEnum.SetTreatmentMapType).pipe(
    switchMap(action => {
      const log = (type: string) =>
        logEventAction({
          category: "Treatment Map Type",
          action: type
        });
      if (action.payload === TreatmentMapType.TREATMENT_FAILURE) {
        return of(log("Treatment failure"));
      } else if (action.payload === TreatmentMapType.MOLECULAR_MARKERS) {
        return of(log("Molecular markers of drug resistance"));
      } else if (
        action.payload === TreatmentMapType.DELAYED_PARASITE_CLEARANCE
      ) {
        return of(log("Delayed parasite clearance"));
      }
      return of();
    })
  );

export const setTreatmentPlasmodiumSpeciesEpic = (
  action$: ActionsObservable<ActionType<typeof setTreatmentPlasmodiumSpecies>>
) =>
  action$
    .ofType(ActionTypeEnum.SetPlasmodiumSpecies)
    .pipe(skip(1))
    .pipe(
      switchMap(action => {
        return of(
          logEventAction({
            category: "Plasmodium Species",
            action: action.payload
          })
        );
      })
    );

export const setTreatmentDrugEpic = (
  action$: ActionsObservable<ActionType<typeof setTreatmentDrug>>
) =>
  action$
    .ofType(ActionTypeEnum.SetDrug)
    .pipe(skip(1))
    .pipe(
      switchMap(action => {
        return of(
          logEventAction({
            category: "Drug",
            action: action.payload
          })
        );
      })
    );

export const setMolecularMarkerEpic = (
  action$: ActionsObservable<ActionType<typeof setMolecularMarker>>
) =>
  action$
    .ofType(ActionTypeEnum.SetMolecularMarker)
    .pipe(skip(1))
    .pipe(
      switchMap(action => {
        return of(
          logEventAction({
            category: "Molecular marker",
            action: MOLECULAR_MARKERS.find(mm => mm.value === action.payload)
              .label
          })
        );
      })
    );
