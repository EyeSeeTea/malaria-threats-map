import { createAction } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import { AjaxError } from "rxjs/ajax";

export const fetchDistrictsRequest = createAction(ActionTypeEnum.FetchDistrictsRequest)<string>();

export const fetchDistrictsSuccess = createAction(ActionTypeEnum.FetchDistrictsSuccess)<any>();

export const fetchDistrictsError = createAction(ActionTypeEnum.FetchDistrictsError)<AjaxError>();
