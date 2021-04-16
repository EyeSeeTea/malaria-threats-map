import { ActionsObservable } from "redux-observable";
import { ActionType } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import { catchError, mergeMap, switchMap } from "rxjs/operators";
import * as ajax from "../../store/ajax";
import { AjaxError } from "rxjs/ajax";
import { of } from "rxjs";
import { fetchDistrictsError, fetchDistrictsRequest, fetchDistrictsSuccess } from "../actions/district-actions";

const DISTRICTS =
    "https://services.arcgis.com/5T5nSi527N4F7luB/ArcGIS/rest/services/POLIO_ADMINISTRATIVE_BOUNDARIES/FeatureServer/4";

export const getDistrictsEpic = (action$: ActionsObservable<ActionType<typeof fetchDistrictsRequest>>) =>
    action$.ofType(ActionTypeEnum.FetchDistrictsRequest).pipe(
        switchMap(action => {
            const params: any = {
                f: "geojson",
                where: encodeURIComponent(`ISO_2_CODE='${action.payload}' AND ENDDATE <> '12/31/9999 12:00:00 AM'`),
                geometryPrecision: 3.0,
                outFields: "OBJECTID,GUID,CENTER_LAT,CENTER_LON",
            };
            const query: string = Object.keys(params)
                .map(key => `${key}=${params[key]}`)
                .join("&");
            return ajax.getFull(`${DISTRICTS}/query?${query}`).pipe(
                mergeMap((response: any) => {
                    return of(fetchDistrictsSuccess(response));
                }),
                catchError((error: AjaxError) => of(fetchDistrictsError(error)))
            );
        })
    );
