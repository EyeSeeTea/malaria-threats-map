import { createAction } from "typesafe-actions";
import { ActionTypeEnum } from "../../store/actions";
import { PreventionResponse } from "../../types/Prevention";
import { AjaxError } from "rxjs/ajax";

export const fetchPreventionStudiesRequest = createAction(
  ActionTypeEnum.FetchPreventionStudiesRequest,
  action => {
    return () => action();
  }
);
export const fetchPreventionStudiesSuccess = createAction(
  ActionTypeEnum.FetchPreventionStudiesSuccess,
  action => {
    return (response: PreventionResponse) => action(response);
  }
);
export const fetchPreventionStudiesError = createAction(
  ActionTypeEnum.FetchPreventionStudiesError,
  action => {
    return (error: AjaxError) => action();
  }
);
