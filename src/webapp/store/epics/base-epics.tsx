import { ofType, StateObservable } from "redux-observable";
import { ActionType } from "typesafe-actions";
import { Observable, of } from "rxjs";
import { catchError, mergeMap, switchMap, withLatestFrom } from "rxjs/operators";
import {
    getLastUpdatedFailureAction,
    getLastUpdatedRequestAction,
    getLastUpdatedSuccessAction,
    logEventAction,
    setBoundsAction,
    setRegionAction,
    setSelection,
    setStoryModeAction,
    setStoryModeStepAction,
    setThemeAction,
    logPageViewAction,
    logOutboundLinkAction,
    uploadFileRequestAction,
    setUploadFileOpenAction,
    uploadFileSuccessAction,
    uploadFileErrorAction,
    setSelectionData,
    setSelectionDataFilterSelection,
} from "../actions/base-actions";
import { State } from "../types";
import * as ajax from "../ajax";
import { MapServerConfig } from "../../constants/constants";
import { addNotificationAction } from "../actions/notifier-actions";
import { AjaxError } from "rxjs/ajax";
import { ErrorResponse } from "../../types/Malaria";
import { getAnalyticsPageViewFromString } from "../analytics";
import { sendAnalytics } from "../../utils/analytics";
import _ from "lodash";
import { fetchCountryLayerRequest } from "../actions/country-layer-actions";
import { ApiParams } from "../../../data/common/types";
import { fromFuture } from "./utils";
import { EpicDependencies } from "..";
import { ActionTypeEnum } from "../actions";
import { createPreventionSelectionData } from "./prevention/utils";
import { createDiagnosisSelectionData } from "./diagnosis/utils";
import { createInvasiveSelectionData } from "./invasive/utils";
import { createTreatmentSelectionData } from "./treatment/utils";

export const setThemeEpic = (action$: Observable<ActionType<typeof setThemeAction>>, state$: StateObservable<State>) =>
    action$.pipe(
        ofType(ActionTypeEnum.MalariaSetTheme),
        withLatestFrom(state$),
        switchMap(([action, _state]) => {
            const base = [
                ...[
                    logEventAction({ category: "theme_menu", action: action.payload }),
                    logPageViewAction(getAnalyticsPageViewFromString({ page: action.payload })),
                ],
                setSelection(null),
                setStoryModeStepAction(0),
            ].filter(Boolean);

            return of(...base);
        })
    );

export const logEvent = (action$: Observable<ActionType<typeof logEventAction>>, state$: StateObservable<State>) =>
    action$.pipe(
        ofType(ActionTypeEnum.MalariaLogEvent),
        withLatestFrom(state$),
        switchMap(([action, _state]) => {
            sendAnalytics({ type: "event", ...action.payload });
            return of();
        })
    );

export const logPageView = (
    action$: Observable<ActionType<typeof logPageViewAction>>,
    state$: StateObservable<State>
) =>
    action$.pipe(
        ofType(ActionTypeEnum.MalariaLogPageView),
        withLatestFrom(state$),
        switchMap(([action, _state]) => {
            sendAnalytics({ type: "pageView", ...action.payload });
            return of();
        })
    );

export const logOutboundLink = (
    action$: Observable<ActionType<typeof logOutboundLinkAction>>,
    state$: StateObservable<State>
) =>
    action$.pipe(
        ofType(ActionTypeEnum.MalariaLogOutboundLink),
        withLatestFrom(state$),
        switchMap(([action, _state]) => {
            sendAnalytics({ type: "outboundLink", label: action.payload });
            return of();
        })
    );

export const setStoryModeStepEpic = (
    action$: Observable<ActionType<typeof setStoryModeStepAction | typeof setStoryModeAction | typeof setThemeAction>>,
    state$: StateObservable<State>
) =>
    action$.pipe(
        ofType(
            ActionTypeEnum.MalariaSetStoryModeStep,
            ActionTypeEnum.MalariaSetStoryMode,
            ActionTypeEnum.MalariaSetTheme
        ),
        withLatestFrom(state$),
        switchMap(([action, state]) => {
            const theme = state.malaria.theme;
            if (!state.malaria.storyMode) {
                return of();
            }
            switch (theme) {
                case "prevention":
                    switch (action.payload) {
                        case 0:
                            return of(setRegionAction({}));
                        case 1:
                            return of(setRegionAction({}));
                        case 2:
                            return of(setRegionAction({ region: "SOUTH-EAST_ASIA" }));
                        case 3:
                            return of(setRegionAction({ region: "AFRICA" }));
                        default:
                            return of();
                    }
                case "diagnosis":
                    switch (action.payload) {
                        case 0:
                            return of(setRegionAction({ country: "PE" }));
                        case 1:
                            return of(setRegionAction({ region: "AFRICA" }));
                        case 2:
                            return of(setRegionAction({}));
                        default:
                            return of();
                    }
                case "treatment":
                    switch (action.payload) {
                        case 0:
                            return of(setRegionAction({}));
                        case 1:
                            return of(setRegionAction({}));
                        case 2:
                            return of(setRegionAction({}));
                        case 3:
                            return of(setRegionAction({}));
                        default:
                            return of();
                    }
                case "invasive":
                    switch (action.payload) {
                        case 0:
                            return of(
                                setRegionAction({}),
                                setBoundsAction([
                                    [23.73159810368128, -5.628262912580524],
                                    [57.46049921128645, 22.484559914680688],
                                ])
                            );
                        case 1:
                            return of(setRegionAction({ country: "PK" }));
                        default:
                            return of();
                    }
                default:
                    return of();
            }
        })
    );

export const logStoryModeStepEpic = (
    action$: Observable<ActionType<typeof setStoryModeStepAction>>,
    state$: StateObservable<State>
) =>
    action$.pipe(
        ofType(ActionTypeEnum.MalariaSetStoryModeStep),
        withLatestFrom(state$),
        switchMap(([action, state]) => {
            const theme = state.malaria.theme;
            if (!state.malaria.storyMode) {
                return of();
            } else {
                const step = (action.payload + 1).toString();
                return of(logEventAction({ category: "storyMode", action: theme, label: step }));
            }
        })
    );

export type LastUpdated = {
    OBJECTID: number;
    TABLE_NAME: string;
    DATE: number;
};
type Response = { features: { attributes: LastUpdated }[] } & ErrorResponse;

export const getLastUpdatedEpic = (action$: Observable<ActionType<typeof getLastUpdatedRequestAction>>) =>
    action$.pipe(
        ofType(ActionTypeEnum.GetLastUpdatedRequest),
        switchMap(() => {
            const params: ApiParams = {
                f: "json",
                where: `1%3D1`,
                outFields: "*",
            };
            const query: string = Object.keys(params)
                .map(key => `${key}=${params[key]}`)
                .join("&");
            return ajax.get<Response>(`/${MapServerConfig.layers.updates}/query?${query}`).pipe(
                mergeMap((response: Response) => {
                    if (response.error) {
                        return of(
                            addNotificationAction(response.error.message),
                            getLastUpdatedFailureAction(response.error.message)
                        );
                    } else {
                        const updatesList = response.features.map(feature => feature.attributes);
                        const updates: any = {};
                        for (const update of updatesList) {
                            switch (update.TABLE_NAME) {
                                case "TREATMENT":
                                    updates["treatment"] = new Date(update.DATE);
                                    break;
                                case "HRP":
                                    updates["diagnosis"] = new Date(update.DATE);
                                    break;
                                case "PREVENTION":
                                    updates["prevention"] = new Date(update.DATE);
                                    break;
                                case "INVASIVE":
                                    updates["invasive"] = new Date(update.DATE);
                                    break;
                                default:
                                    break;
                            }
                        }
                        return of(getLastUpdatedSuccessAction(updates));
                    }
                }),
                catchError((error: AjaxError) =>
                    of(addNotificationAction(error.message), getLastUpdatedFailureAction(error))
                )
            );
        })
    );

export const uploadFileEpic = (
    action$: Observable<ActionType<typeof uploadFileRequestAction>>,
    state$: StateObservable<State>,
    { compositionRoot }: EpicDependencies
) =>
    action$.pipe(
        ofType(ActionTypeEnum.UploadFileRequest),
        withLatestFrom(state$),
        switchMap(([action]) => {
            return fromFuture(compositionRoot.uploadFile.save(action.payload)).pipe(
                mergeMap(() => {
                    return of(
                        addNotificationAction("File uploaded!"),
                        setUploadFileOpenAction(false),
                        uploadFileSuccessAction()
                    );
                }),
                catchError((_error: Error) =>
                    of(addNotificationAction("There was an error while uploading the file"), uploadFileErrorAction())
                )
            );
        })
    );

export const setRegionEpic = (
    action$: Observable<ActionType<typeof setRegionAction>>,
    state$: StateObservable<State>
) =>
    action$.pipe(
        ofType(ActionTypeEnum.MalariaSetRegion),
        withLatestFrom(state$),
        switchMap(([_action, state]) => {
            const { region } = state.malaria;

            const requestCountriesAction = requestCountriesIsRequired(
                state,
                () =>
                    region.country !== undefined ||
                    region.region !== undefined ||
                    region.siteIso2 !== undefined ||
                    region.subRegion !== undefined
            )
                ? fetchCountryLayerRequest()
                : undefined;

            const actions = _.compact([requestCountriesAction]);

            return of(...actions);
        })
    );

function requestCountriesIsRequired(state: State, condition: () => boolean) {
    return !state.countryLayer.loading && state.countryLayer.countries.length === 0 && condition();
}

export const setSelectionToLogEpic = (
    action$: Observable<ActionType<typeof setSelection>>,
    state$: StateObservable<State>
) =>
    action$.pipe(
        ofType(ActionTypeEnum.SetSelection),
        withLatestFrom(state$),
        switchMap(([action, state]) => {
            if (!action.payload) return of();
            const { theme } = state.malaria;
            const logAction = logEventAction({ category: "popup", action: "pin", label: theme });
            return of(logAction);
        })
    );

export const setSelectionEpic = (
    action$: Observable<ActionType<typeof setSelection>>,
    state$: StateObservable<State>
) =>
    action$.pipe(
        ofType(ActionTypeEnum.SetSelection),
        withLatestFrom(state$),
        switchMap(([, state]) => {
            switch (state.malaria.theme) {
                case "prevention": {
                    const selectionData = createPreventionSelectionData(
                        state.malaria.theme,
                        state.prevention.filters.mapType,
                        state.malaria.selection,
                        state.prevention.filteredStudies,
                        state.prevention.studies
                    );

                    return of(setSelectionData(selectionData));
                }
                case "diagnosis": {
                    const selectionData = createDiagnosisSelectionData(
                        state.malaria.theme,
                        state.malaria.selection,
                        state.diagnosis.filteredStudies
                    );

                    return of(setSelectionData(selectionData));
                }
                case "treatment": {
                    const selectionData = createTreatmentSelectionData(
                        state.malaria.theme,
                        state.treatment.filters,
                        state.malaria.filters,
                        state.malaria.selection,
                        state.treatment.filteredStudies
                    );

                    return of(setSelectionData(selectionData));
                }
                case "invasive": {
                    const selectionData = createInvasiveSelectionData(
                        state.malaria.theme,
                        state.malaria.selection,
                        state.invasive.filteredStudies
                    );

                    return of(setSelectionData(selectionData));
                }
                default:
                    return of();
            }
        })
    );

export const setSelectionDataFilterSelectionEpic = (
    action$: Observable<ActionType<typeof setSelectionDataFilterSelection>>,
    state$: StateObservable<State>
) =>
    action$.pipe().pipe(
        ofType(ActionTypeEnum.SetSelectionDataFilterSelection),
        withLatestFrom(state$),
        switchMap(([action, state]) => {
            switch (state.malaria.theme) {
                case "prevention": {
                    const selectionData = createPreventionSelectionData(
                        state.malaria.theme,
                        state.prevention.filters.mapType,
                        state.malaria.selection,
                        state.prevention.filteredStudies,
                        state.prevention.studies,
                        action.payload
                    );

                    return of(setSelectionData(selectionData));
                }
                default:
                    return of();
            }
        })
    );
