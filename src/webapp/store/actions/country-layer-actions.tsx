import { createAction } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import { CountryLayer } from "../../../domain/entities/CountryLayer";

export const fetchCountryLayerRequest = createAction(ActionTypeEnum.FetchCountryLayerRequest, action => {
    return () => action();
});
export const fetchCountryLayerSuccess = createAction(ActionTypeEnum.FetchCountryLayerSuccess, action => {
    return (response: CountryLayer) => action(response);
});
export const fetchCountryLayerError = createAction(ActionTypeEnum.FetchCountryLayerError, action => {
    return () => action();
});
