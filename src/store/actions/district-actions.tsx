import { createAction } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import { AjaxError } from "rxjs/ajax";

export const fetchDistrictsRequest = createAction(
  ActionTypeEnum.FetchDistrictsRequest,
  action => {
    return (country: string) => action(country);
  }
);
export const fetchDistrictsSuccess = createAction(
  ActionTypeEnum.FetchDistrictsSuccess,
  action => {
    return (response: any) => action(response);
  }
);
export const fetchDistrictsError = createAction(
  ActionTypeEnum.FetchDistrictsError,
  action => {
    return (error: AjaxError) => action();
  }
);
