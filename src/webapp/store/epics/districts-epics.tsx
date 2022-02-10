import { ActionType } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import { catchError, mergeMap, switchMap } from "rxjs/operators";
import * as ajax from "../../store/ajax";
import { AjaxError } from "rxjs/ajax";
import { ApiParams } from "../../../data/common/types";
import { Observable, of } from "rxjs";
import { fetchDistrictsError, fetchDistrictsRequest, fetchDistrictsSuccess } from "../actions/district-actions";
import { ofType } from "redux-observable";

const DISTRICTS =
    "https://services.arcgis.com/5T5nSi527N4F7luB/arcgis/rest/services/Detailed_Boundary_ADM2/FeatureServer/0";

export const getDistrictsEpic = (action$: Observable<ActionType<typeof fetchDistrictsRequest>>) =>
    action$.pipe(
        ofType(ActionTypeEnum.FetchDistrictsRequest),
        switchMap(action => {
            const params: ApiParams = {
                f: "geojson",
                where: encodeURIComponent(`ISO_2_CODE='${action.payload}' AND ENDDATE = '12/31/9999 12:00:00 AM'`),
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
