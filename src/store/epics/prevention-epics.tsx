import { ActionsObservable, StateObservable } from "redux-observable";
import { ActionType } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
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
import { PreventionResponse } from "../../types/Prevention";
import { MapServerConfig } from "../../constants/constants";
import {
  fetchPreventionStudiesError,
  fetchPreventionStudiesRequest,
  fetchPreventionStudiesSuccess,
  setAssayTypes,
  setInsecticideClass,
  setInsecticideTypes,
  setPreventionMapType,
  setSpecies,
  setSynergistTypes,
  setType
} from "../actions/prevention-actions";
import { PreventionMapType, State } from "../types";
import { logEventAction, logPageViewAction } from "../actions/base-actions";
import { ASSAY_TYPES } from "../../components/filters/AssayTypeCheckboxFilter";
import { ErrorResponse } from "../../types/Malaria";
import { addNotificationAction } from "../actions/notifier-actions";
import { getAnalyticsPageView } from "../analytics";

interface Params {
  [key: string]: string | number | boolean;
}

type Response = PreventionResponse & ErrorResponse;

export const getPreventionStudiesEpic = (
  action$: ActionsObservable<ActionType<typeof fetchPreventionStudiesRequest>>
) =>
  action$.ofType(ActionTypeEnum.FetchPreventionStudiesRequest).pipe(
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
        .get(`/${MapServerConfig.layers.prevention}/query?${query}`)
        .pipe(
          mergeMap((response: Response) => {
            if (response.error) {
              return of(
                addNotificationAction(response.error.message),
                fetchPreventionStudiesError(response.error.message)
              );
            } else {
              return of(fetchPreventionStudiesSuccess(response));
            }
          }),
          catchError((error: AjaxError) =>
            of(
              addNotificationAction(error.message),
              fetchPreventionStudiesError(error)
            )
          )
        );
    })
  );

export const setPreventionMapTypeEpic = (
  action$: ActionsObservable<ActionType<typeof setPreventionMapType>>
) =>
  action$.ofType(ActionTypeEnum.SetPreventionMapType).pipe(
    switchMap(action => {
      const log = (type: string) =>
        logEventAction({
          category: "Prevention Map Type",
          action: type
        });

      const pageView = getAnalyticsPageView({ page: "prevention", section: action.payload });
      const logPageView = logPageViewAction(pageView);

      if (action.payload === PreventionMapType.RESISTANCE_MECHANISM) {
        return of(
          setType("MONO_OXYGENASES"),
          log("Resistance mechanisms detection"),
          logPageView
        );
      } else if (action.payload === PreventionMapType.INTENSITY_STATUS) {
        return of(setType(undefined), log("Insecticide resistance intensity"), logPageView);
      } else if (action.payload === PreventionMapType.RESISTANCE_STATUS) {
        return of(setType(undefined), log("Insecticide resistance status"), logPageView);
      } else if (action.payload === PreventionMapType.LEVEL_OF_INVOLVEMENT) {
        return of(
          setType("MONO_OXYGENASES"),
          log("Metabolic mechanisms involvement"),
          logPageView
        );
      } else if (action.payload === PreventionMapType.PBO_DEPLOYMENT) {
        return of(setType(undefined), log("Pyrethroid-PBO nets deployment"), logPageView);
      }
      return of(setType(undefined), logPageView);
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

export const setPreventionInsecticideClassEpic = (
  action$: ActionsObservable<ActionType<typeof setInsecticideClass>>,
  state$: StateObservable<State>
) =>
  action$
    .ofType(ActionTypeEnum.SetInsecticideClass)
    .pipe(skip(1))
    .pipe(
      withLatestFrom(state$),
      switchMap(([action, state]) => {
        return of(
          setInsecticideTypes([]),
          setType(state.prevention.filters.type || "MONO_OXYGENASES"),
          setSpecies([]),
          logEventAction({
            category: "filter",
            action: "insecticideClass",
            label: action.payload
          })
        );
      })
    );

export const setPreventionInsecticideTypeEpic = (
  action$: ActionsObservable<ActionType<typeof setInsecticideTypes>>
) =>
  action$
    .ofType(ActionTypeEnum.SetInsecticideTypes)
    .pipe(skip(1))
    .pipe(
      switchMap(action => {
        const actions: any[] = [setType(undefined), setSpecies([])];
        (action.payload || []).forEach(type =>
          actions.push(
            logEventAction({
              category: "filter",
              action: "InsecticideType",
              label: type
            })
          )
        );
        return of(...actions);
      })
    );

export const setPreventionTypeResetEpic = (
  action$: ActionsObservable<ActionType<typeof setType>>
) =>
  action$
    .ofType(ActionTypeEnum.SetType)
    .pipe(skip(1))
    .pipe(
      switchMap(action => {
        return of(
          setSpecies([]),
          logEventAction({
            category: "filter",
            action: "mechanismType",
            label: action.payload
          })
        );
      })
    );

export const setPreventionSynergistTypesEpic = (
  action$: ActionsObservable<ActionType<typeof setSynergistTypes>>
) =>
  action$
    .ofType(ActionTypeEnum.SetSynergistTypes)
    .pipe(skip(1))
    .pipe(
      switchMap(action => {
        const actions: any[] = [];
        (action.payload || []).forEach(type =>
          actions.push(
            logEventAction({
              category: "Synergist Type",
              action: type
            })
          )
        );
        return of(...actions);
      })
    );

export const setPreventionSpeciesEpic = (
  action$: ActionsObservable<ActionType<typeof setSpecies>>
) =>
  action$
    .ofType(ActionTypeEnum.SetSpecies)
    .pipe(skip(1))
    .pipe(
      switchMap(action => {
        const actions: any[] = [];
        (action.payload || []).forEach(species =>
          actions.push(
            logEventAction({
              category: "filter",
              action: "vectorSpecies",
              label: species
            })
          )
        );
        return of(...actions);
      })
    );

export const setPreventionAssayTypesEpic = (
  action$: ActionsObservable<ActionType<typeof setAssayTypes>>
) =>
  action$
    .ofType(ActionTypeEnum.SetAssayTypes)
    .pipe(skip(1))
    .pipe(
      switchMap(action => {
        const actions: any[] = [];
        (action.payload || []).forEach(assayType =>
          actions.push(
            logEventAction({ category: "filter", action: "assayType", label: assayType })
          )
        );
        return of(...actions);
      })
    );
