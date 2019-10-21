import {ActionsObservable} from "redux-observable";
import {ActionType} from "typesafe-actions";
import {ActionTypeEnum} from "../actions";
import {catchError, mergeMap, switchMap} from "rxjs/operators";
import * as ajax from "../../store/ajax";
import {AjaxError} from "rxjs/ajax";
import {of} from "rxjs";
import {
    fetchCountryLayerError,
    fetchCountryLayerRequest,
    fetchCountryLayerSuccess
} from "../actions/country-layer-actions";
import {MapServerConfig} from "../../constants/constants";

export const getCountriesEpic = (
  action$: ActionsObservable<ActionType<typeof fetchCountryLayerRequest>>
) =>
  action$.ofType(ActionTypeEnum.FetchCountryLayerRequest).pipe(
    switchMap(action => {
      const params: any = {
        f: "geojson",
        where: `1=1`,
        outFields: "ADM0_SOVRN,ADM0_NAME,CENTER_LAT,CENTER_LON,ISO_2_CODE"
      };
      const query: string = Object.keys(params)
        .map(key => `${key}=${params[key]}`)
        .join("&");
      return ajax
        .get(`/${MapServerConfig.layers.countries}/query?${query}`)
        .pipe(
          mergeMap((response: any) => {
            return of(fetchCountryLayerSuccess(response));
          }),
          catchError((error: AjaxError) => of(fetchCountryLayerError(error)))
        );
    })
  );
