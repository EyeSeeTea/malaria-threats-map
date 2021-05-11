import { ActionsObservable, StateObservable } from "redux-observable";
import { ActionType } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import { catchError, mergeMap, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import {
    fetchCountryLayerError,
    fetchCountryLayerRequest,
    fetchCountryLayerSuccess,
} from "../actions/country-layer-actions";
import { CountryLayer } from "../../../domain/entities/CountryLayer";
import { fromFuture } from "./utils";
import { State } from "../types";
import { EpicDependencies } from "..";

export const getCountriesEpic = (
    action$: ActionsObservable<ActionType<typeof fetchCountryLayerRequest>>,
    _state$: StateObservable<State>,
    { compositionRoot }: EpicDependencies
) =>
    action$.ofType(ActionTypeEnum.FetchCountryLayerRequest).pipe(
        switchMap(_action => {
            return fromFuture(compositionRoot.countryLayer.get()).pipe(
                mergeMap((countryLayer: CountryLayer) => {
                    return of(fetchCountryLayerSuccess(countryLayer));
                }),
                catchError(() => of(fetchCountryLayerError()))
            );
        })
    );
