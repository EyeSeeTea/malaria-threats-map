import { ActionsObservable, StateObservable } from "redux-observable";
import { ActionType } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import { of } from "rxjs";
import { catchError, mergeMap, switchMap, withLatestFrom } from "rxjs/operators";
import {
    getLastUpdatedFailureAction,
    getLastUpdatedRequestAction,
    getLastUpdatedSuccessAction,
    logEventAction,
    setBoundsAction,
    setCountryModeAction,
    setRegionAction,
    setSelection,
    setStoryModeAction,
    setStoryModeStepAction,
    setThemeAction,
    logPageViewAction,
    logOutboundLinkAction,
} from "../actions/base-actions";
import { PreventionMapType, State } from "../types";
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


export const setThemeEpic = (
    action$: ActionsObservable<ActionType<typeof setThemeAction>>,
    state$: StateObservable<State>
) =>
    action$.ofType(ActionTypeEnum.MalariaSetTheme).pipe(
        withLatestFrom(state$),
        switchMap(([action, state]) => {
            const { meta } = action;
            const eventCategory = meta.fromHome ? "homeItem" : "theme_menu";
            const base = [
                logEventAction({ category: eventCategory, action: action.payload }),
                logPageViewAction(getAnalyticsPageViewFromString({ page: action.payload })),
                setSelection(null),
                setStoryModeStepAction(0),
            ].filter(Boolean);

            switch (action.payload) {
                case "invasive":
                    return of(...[setCountryModeAction(false), ...base]);
                case "prevention":
                    if (state.prevention.filters.mapType === PreventionMapType.PBO_DEPLOYMENT) {
                        return of(...[setCountryModeAction(false), ...base]);
                    }
                    return of(...base);
                default:
                    return of(...base);
            }
        })
    );

export const setSelectionEpic = (
    action$: ActionsObservable<ActionType<typeof setSelection>>,
    state$: StateObservable<State>
) =>
    action$.ofType(ActionTypeEnum.SetSelection).pipe(
        withLatestFrom(state$),
        switchMap(([action, state]) => {
            if (!action.payload) return of();
            const { theme } = state.malaria;
            const logAction = logEventAction({ category: "popup", action: "pin", label: theme });
            return of(logAction);
        })
    );

export const logEvent = (
    action$: ActionsObservable<ActionType<typeof logEventAction>>,
    state$: StateObservable<State>
) =>
    action$.ofType(ActionTypeEnum.MalariaLogEvent).pipe(
        withLatestFrom(state$),
        switchMap(([action, _state]) => {
            sendAnalytics({ type: "event", ...action.payload });
            return of();
        })
    );

export const logPageView = (
    action$: ActionsObservable<ActionType<typeof logPageViewAction>>,
    state$: StateObservable<State>
) =>
    action$.ofType(ActionTypeEnum.MalariaLogPageView).pipe(
        withLatestFrom(state$),
        switchMap(([action, _state]) => {
            sendAnalytics({ type: "pageView", ...action.payload });
            return of();
        })
    );

export const logOutboundLink = (
    action$: ActionsObservable<ActionType<typeof logOutboundLinkAction>>,
    state$: StateObservable<State>
) =>
    action$.ofType(ActionTypeEnum.MalariaLogOutboundLink).pipe(
        withLatestFrom(state$),
        switchMap(([action, _state]) => {
            sendAnalytics({ type: "outboundLink", label: action.payload });
            return of();
        })
    );

export const setStoryModeStepEpic = (
    action$: ActionsObservable<
        ActionType<typeof setStoryModeStepAction | typeof setStoryModeAction | typeof setThemeAction>
    >,
    state$: StateObservable<State>
) =>
    action$
        .ofType(
            ActionTypeEnum.MalariaSetStoryModeStep,
            ActionTypeEnum.MalariaSetStoryMode,
            ActionTypeEnum.MalariaSetTheme
        )
        .pipe(
            withLatestFrom(state$),
            switchMap(([action, state]) => {
                const theme = state.malaria.theme;
                if (!state.malaria.storyMode) {
                    return of();
                }
                switch (theme) {
                    case "prevention":
                        if (state.prevention.filters.mapType === PreventionMapType.PBO_DEPLOYMENT) {
                            return of();
                        }
                        switch (action.payload) {
                            case 0:
                                return of(setCountryModeAction(true), setRegionAction({}));
                            case 1:
                                return of(setCountryModeAction(false), setRegionAction({}));
                            case 2:
                                return of(setCountryModeAction(false), setRegionAction({ region: "SOUTH-EAST_ASIA" }));
                            case 3:
                                return of(setCountryModeAction(false), setRegionAction({ region: "AFRICA" }));
                            default:
                                return of();
                        }
                    case "diagnosis":
                        switch (action.payload) {
                            case 0:
                                return of(setCountryModeAction(false), setRegionAction({ country: "PERU" }));
                            case 1:
                                return of(setCountryModeAction(false), setRegionAction({ region: "AFRICA" }));
                            case 2:
                                return of(setCountryModeAction(true), setRegionAction({}));
                            default:
                                return of();
                        }
                    case "treatment":
                        switch (action.payload) {
                            case 0:
                                return of(setCountryModeAction(true), setRegionAction({}));
                            case 1:
                                return of(setCountryModeAction(true), setRegionAction({}));
                            case 2:
                                return of(setCountryModeAction(true), setRegionAction({}));
                            case 3:
                                return of(setCountryModeAction(false), setRegionAction({}));
                            default:
                                return of();
                        }
                    case "invasive":
                        switch (action.payload) {
                            case 0:
                                return of(
                                    setCountryModeAction(false),
                                    setRegionAction({}),
                                    setBoundsAction([
                                        [23.73159810368128, -5.628262912580524],
                                        [57.46049921128645, 22.484559914680688],
                                    ])
                                );
                            case 1:
                                return of(setCountryModeAction(false), setRegionAction({ country: "PAKISTAN" }));
                            case 2:
                                return of(setCountryModeAction(false));
                            default:
                                return of();
                        }
                    default:
                        return of();
                }
            })
        );

export const logStoryModeStepEpic = (
    action$: ActionsObservable<ActionType<typeof setStoryModeStepAction>>,
    state$: StateObservable<State>
) =>
    action$.ofType(ActionTypeEnum.MalariaSetStoryModeStep).pipe(
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

export const getLastUpdatedEpic = (action$: ActionsObservable<ActionType<typeof getLastUpdatedRequestAction>>) =>
    action$.ofType(ActionTypeEnum.GetLastUpdatedRequest).pipe(
        switchMap(() => {
            const params: ApiParams = {
                f: "json",
                where: `1%3D1`,
                outFields: "*",
            };
            const query: string = Object.keys(params)
                .map(key => `${key}=${params[key]}`)
                .join("&");
            return ajax.get(`/${MapServerConfig.layers.updates}/query?${query}`).pipe(
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

export const setCountryModeEpic = (
    action$: ActionsObservable<ActionType<typeof setCountryModeAction>>,
    state$: StateObservable<State>
) =>
    action$.ofType(ActionTypeEnum.MalariaSetCountryMode).pipe(
        withLatestFrom(state$),
        switchMap(([_action, state]) => {
            const requestCountriesAction = requestCountriesIsRequired(state, () => state.malaria.countryMode)
                ? fetchCountryLayerRequest()
                : undefined;

            const setRegionIsRequired =
                !state.malaria.countryMode &&
                state.malaria.theme === "prevention" &&
                state.prevention.filters.mapType === PreventionMapType.PBO_DEPLOYMENT
                    ? setRegionAction({})
                    : undefined;

            const actions = _.compact([requestCountriesAction, setRegionIsRequired]);

            return of(...actions);
        })
    );

export const setRegionEpic = (
    action$: ActionsObservable<ActionType<typeof setRegionAction>>,
    state$: StateObservable<State>
) =>
    action$.ofType(ActionTypeEnum.MalariaSetRegion).pipe(
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
