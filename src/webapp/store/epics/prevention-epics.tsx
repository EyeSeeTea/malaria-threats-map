import { ofType, StateObservable } from "redux-observable";
import { ActionType } from "typesafe-actions";
import _ from "lodash";
import { ActionTypeEnum } from "../actions";
import { Observable, of } from "rxjs";
import { catchError, mergeMap, skip, switchMap, withLatestFrom } from "rxjs/operators";
import {
    fetchPreventionStudiesError,
    fetchPreventionStudiesRequest,
    fetchPreventionStudiesSuccess,
    setAssayTypes,
    setInsecticideClass,
    setInsecticideTypes,
    setPreventionMapType,
    setSpecies,
    setType,
} from "../actions/prevention-actions";
import { PreventionMapType, State } from "../types";
import { logEventAction, logPageViewAction } from "../actions/base-actions";
import { ASSAY_TYPES } from "../../components/filters/AssayTypeCheckboxFilter";
import { addNotificationAction } from "../actions/notifier-actions";
import { getAnalyticsPageView } from "../analytics";
import { fromFuture } from "./utils";
import { PreventionStudy } from "../../../domain/entities/PreventionStudy";
import { EpicDependencies } from "../../store/index";

export const getPreventionStudiesEpic = (
    action$: Observable<ActionType<typeof fetchPreventionStudiesRequest>>,
    state$: StateObservable<State>,
    { compositionRoot }: EpicDependencies
) =>
    action$.pipe(
        ofType(ActionTypeEnum.FetchPreventionStudiesRequest),
        withLatestFrom(state$),
        switchMap(([, state]) => {
            if (state.prevention.studies.length === 0 && !state.prevention.error) {
                return fromFuture(compositionRoot.prevention.getStudies()).pipe(
                    mergeMap((studies: PreventionStudy[]) => {
                        return of(fetchPreventionStudiesSuccess(studies));
                    }),
                    catchError((error: Error) =>
                        of(addNotificationAction(error.message), fetchPreventionStudiesError())
                    )
                );
            } else {
                return of(fetchPreventionStudiesSuccess(state.prevention.studies));
            }
        })
    );

export const setPreventionMapTypeEpic = (
    action$: Observable<ActionType<typeof setPreventionMapType>>,
    state$: StateObservable<State>
) =>
    action$.pipe(
        ofType(ActionTypeEnum.SetPreventionMapType),
        withLatestFrom(state$),
        switchMap(([action, _state]) => {
            const pageView = getAnalyticsPageView({ page: "prevention", section: action.payload });

            const logPageView = logPageViewAction(pageView);

            if (action.payload === PreventionMapType.RESISTANCE_MECHANISM) {
                return of(..._.compact([setType("MONO_OXYGENASES"), logPageView]));
            } else if (action.payload === PreventionMapType.INTENSITY_STATUS) {
                return of(..._.compact([setType(undefined), logPageView]));
            } else if (action.payload === PreventionMapType.RESISTANCE_STATUS) {
                return of(..._.compact([setType(undefined), logPageView]));
            } else if (action.payload === PreventionMapType.LEVEL_OF_INVOLVEMENT) {
                return of(..._.compact([setType("MONO_OXYGENASES"), logPageView]));
            } else {
                return of(..._.compact([setType(undefined), logPageView]));
            }
        })
    );

export const setPreventionTypeEpic = (action$: Observable<ActionType<typeof setType>>) =>
    action$.pipe(
        ofType(ActionTypeEnum.SetType),
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
    action$: Observable<ActionType<typeof setInsecticideClass>>,
    state$: StateObservable<State>
) =>
    action$.pipe(skip(1)).pipe(
        ofType(ActionTypeEnum.SetInsecticideClass),
        withLatestFrom(state$),
        switchMap(([action, state]) => {
            const isTourOpen = state.malaria.tour.open;
            const actions = _.compact([
                setInsecticideTypes([]),
                setType(state.prevention.filters.type || "MONO_OXYGENASES"),
                setSpecies([]),
                isTourOpen
                    ? null
                    : logEventAction({ category: "filter", action: "insecticideClass", label: action.payload }),
            ]);
            return of(...actions);
        })
    );

export const setPreventionInsecticideTypeEpic = (action$: Observable<ActionType<typeof setInsecticideTypes>>) =>
    action$.pipe(skip(1)).pipe(
        ofType(ActionTypeEnum.SetInsecticideTypes),
        switchMap(() => {
            const actions: any[] = [setType(undefined), setSpecies([])];
            return of(...actions);
        })
    );

export const setPreventionTypeResetEpic = (action$: Observable<ActionType<typeof setType>>) =>
    action$.pipe(skip(1)).pipe(
        ofType(ActionTypeEnum.SetType),
        switchMap(_action => {
            return of(setSpecies([]));
        })
    );
