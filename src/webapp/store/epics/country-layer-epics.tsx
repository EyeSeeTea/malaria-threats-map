import { ofType, StateObservable } from "redux-observable";
import { ActionType } from "typesafe-actions";
import { catchError, mergeMap, switchMap } from "rxjs/operators";
import { Observable, of } from "rxjs";
import {
    fetchCountryLayerError,
    fetchCountryLayerRequest,
    fetchCountryLayerSuccess,
} from "../actions/country-layer-actions";
import { CountryLayer } from "../../../domain/entities/CountryLayer";
import { fromFuture } from "./utils";
import { State } from "../types";
import { EpicDependencies } from "..";
import { ActionTypeEnum } from "../actions";

export const getCountriesEpic = (
    action$: Observable<ActionType<typeof fetchCountryLayerRequest>>,
    _state$: StateObservable<State>,
    { compositionRoot }: EpicDependencies
) =>
    action$.pipe(
        ofType(ActionTypeEnum.FetchCountryLayerRequest),
        switchMap(_action => {
            return fromFuture(compositionRoot.countryLayer.get()).pipe(
                mergeMap((countryLayer: CountryLayer) => {
                    return of(fetchCountryLayerSuccess(countryLayer));
                }),
                catchError(() => of(fetchCountryLayerError()))
            );
        })
    );
