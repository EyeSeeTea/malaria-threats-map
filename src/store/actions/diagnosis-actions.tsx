import { createAction } from "typesafe-actions";
import { ActionTypeEnum } from "../../store/actions";
import { DiagnosisResponse } from "../../types/Diagnosis";
import { AjaxError } from "rxjs/ajax";

export const fetchDiagnosisStudiesRequest = createAction(
  ActionTypeEnum.FetchDiagnosisStudiesRequest,
  action => {
    return () => action();
  }
);
export const fetchDiagnosisStudiesSuccess = createAction(
  ActionTypeEnum.FetchDiagnosisStudiesSuccess,
  action => {
    return (response: DiagnosisResponse) => action(response);
  }
);
export const fetchDiagnosisStudiesError = createAction(
  ActionTypeEnum.FetchDiagnosisStudiesError,
  action => {
    return (error: AjaxError) => action();
  }
);
