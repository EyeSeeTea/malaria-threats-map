import { createAction } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import { TreatmentResponse } from "../../types/Treatment";
import { AjaxError } from "rxjs/ajax";

export const fetchTreatmentStudiesRequest = createAction(
  ActionTypeEnum.FetchTreatmentStudiesRequest,
  action => {
    return () => action();
  }
);
export const fetchTreatmentStudiesSuccess = createAction(
  ActionTypeEnum.FetchTreatmentStudiesSuccess,
  action => {
    return (response: TreatmentResponse) => action(response);
  }
);
export const fetchTreatmentStudiesError = createAction(
  ActionTypeEnum.FetchTreatmentStudiesError,
  action => {
    return (error: AjaxError) => action();
  }
);
