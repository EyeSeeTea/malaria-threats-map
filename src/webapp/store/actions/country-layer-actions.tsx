import { createAction } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import { CountryLayer } from "../../../domain/entities/CountryLayer";

export const fetchCountryLayerRequest = createAction(ActionTypeEnum.FetchCountryLayerRequest)();

export const fetchCountryLayerSuccess = createAction(ActionTypeEnum.FetchCountryLayerSuccess)<CountryLayer>();

export const fetchCountryLayerError = createAction(ActionTypeEnum.FetchCountryLayerError)();
