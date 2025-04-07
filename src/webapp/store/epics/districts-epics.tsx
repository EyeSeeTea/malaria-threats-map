import { ActionType } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import { catchError, mergeMap, switchMap } from "rxjs/operators";
import * as ajax from "../../store/ajax";
import { AjaxError } from "rxjs/ajax";
import { ApiParams } from "../../../data/common/types";
import { Observable, of } from "rxjs";
import { fetchDistrictsError, fetchDistrictsRequest, fetchDistrictsSuccess } from "../actions/district-actions";
import { ofType, StateObservable } from "redux-observable";
import { EpicDependencies } from "../../store/index";
import { State } from "../types";

// NOTICE: this epic is not used in the app
export const getDistrictsEpic = (
    action$: Observable<ActionType<typeof fetchDistrictsRequest>>,
    _state$: StateObservable<State>,
    { compositionRoot }: EpicDependencies
) =>
    action$.pipe(
        ofType(ActionTypeEnum.FetchDistrictsRequest),
        switchMap(action => {
            return getDistricts(compositionRoot.districtsUrl, action.payload).pipe(
                mergeMap((response: any) => {
                    return of(fetchDistrictsSuccess(response));
                }),
                catchError((error: AjaxError) => of(fetchDistrictsError(error)))
            );
        })
    );

function getDistricts(districtsUrl: string, iso2Code: string) {
    const params: ApiParams = {
        f: "geojson",
        where: encodeURIComponent(`ISO_2_CODE='${iso2Code}' AND ENDDATE = '12/31/9999 12:00:00 AM'`),
        geometryPrecision: 3.0,
        outFields: "OBJECTID,GUID,CENTER_LAT,CENTER_LON",
    };

    const query: string = Object.keys(params)
        .map(key => `${key}=${params[key]}`)
        .join("&");

    return ajax.getFull(`${districtsUrl}/query?${query}`);
}
