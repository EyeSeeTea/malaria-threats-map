import { createAction } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import { AjaxError } from "rxjs/ajax";

export const fetchCountryLayerRequest = createAction(ActionTypeEnum.FetchCountryLayerRequest, action => {
    return () => action();
});
export const fetchCountryLayerSuccess = createAction(ActionTypeEnum.FetchCountryLayerSuccess, action => {
    return (response: any) => action(response);
});
export const fetchCountryLayerError = createAction(ActionTypeEnum.FetchCountryLayerError, action => {
    return (_error: AjaxError) => action();
});
