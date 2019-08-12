import { createAction } from "typesafe-actions";
import { ActionTypeEnum } from "../../store/actions";
import { InvasiveResponse } from "../../types/Invasive";
import { AjaxError } from "rxjs/ajax";

export const fetchInvasiveStudiesRequest = createAction(
  ActionTypeEnum.FetchInvasiveStudiesRequest,
  action => {
    return () => action();
  }
);
export const fetchInvasiveStudiesSuccess = createAction(
  ActionTypeEnum.FetchInvasiveStudiesSuccess,
  action => {
    return (response: InvasiveResponse) => action(response);
  }
);
export const fetchInvasiveStudiesError = createAction(
  ActionTypeEnum.FetchInvasiveStudiesError,
  action => {
    return (error: AjaxError) => action();
  }
);
