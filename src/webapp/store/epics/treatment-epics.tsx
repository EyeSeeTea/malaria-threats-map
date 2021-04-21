import {ActionsObservable} from "redux-observable";
import {ActionType} from "typesafe-actions";
import {ActionTypeEnum} from "../actions";
import * as ajax from "../../store/ajax";
import {of} from "rxjs";
import {catchError, mergeMap, skip, switchMap} from "rxjs/operators";
import {AjaxError} from "rxjs/ajax";
import {TreatmentResponse} from "../../types/Treatment";
import {
    fetchTreatmentStudiesError,
    fetchTreatmentStudiesRequest,
    fetchTreatmentStudiesSuccess,
    setMolecularMarker,
    setTreatmentDrug,
    setTreatmentMapType,
    setTreatmentPlasmodiumSpecies,
} from "../actions/treatment-actions";
import {MapServerConfig} from "../../constants/constants";
import {logPageViewAction} from "../actions/base-actions";
import {TreatmentMapType} from "../types";
import {addNotificationAction} from "../actions/notifier-actions";
import {ErrorResponse} from "../../types/Malaria";
import {getAnalyticsPageView} from "../analytics";

interface Params {
    [key: string]: string | number | boolean;
}

type Response = TreatmentResponse & ErrorResponse;

export const getTreatmentStudiesEpic = (
    action$: ActionsObservable<ActionType<typeof fetchTreatmentStudiesRequest>>
) =>
    action$.ofType(ActionTypeEnum.FetchTreatmentStudiesRequest).pipe(
        switchMap(() => {
            const params: Params = {
                f: "json",
                where: `1%3D1`,
                outFields: "*",
            };
            const query: string = Object.keys(params)
                .map((key) => `${key}=${params[key]}`)
                .join("&");
            return ajax.get(`/${MapServerConfig.layers.treatment}/query?${query}`).pipe(
                mergeMap((response: Response) => {
                    if (response.error) {
                        return of(
                            addNotificationAction(response.error.message),
                            fetchTreatmentStudiesError(response.error.message)
                        );
                    } else {
                        return of(fetchTreatmentStudiesSuccess(response));
                    }
                }),
                catchError((error: AjaxError) =>
                    of(
                        addNotificationAction(error.message),
                        fetchTreatmentStudiesError(error.message)
                    )
                )
            );
        })
    );

export const setTreatmentThemeEpic = (
    action$: ActionsObservable<ActionType<typeof setTreatmentMapType>>
) =>
    action$.ofType(ActionTypeEnum.SetTreatmentMapType).pipe(
        switchMap((action) => {
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
        switchMap((action) => {
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
        switchMap((action) => {
            const pageView = getAnalyticsPageView({page: "treatment", section: action.payload});
            const logPageView = logPageViewAction(pageView);
            if (action.payload === TreatmentMapType.TREATMENT_FAILURE) {
                return of(logPageView);
            } else if (action.payload === TreatmentMapType.MOLECULAR_MARKERS) {
                return of(logPageView);
            } else if (action.payload === TreatmentMapType.DELAYED_PARASITE_CLEARANCE) {
                return of(logPageView);
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
            switchMap((action) => {
                if (["P._FALCIPARUM", "P._KNOWLESI", "P._OVALE"].includes(action.payload)) {
                    return of(setTreatmentDrug("DRUG_AL"));
                } else {
                    return of(setTreatmentDrug("DRUG_CQ"));
                }
            })
        );
