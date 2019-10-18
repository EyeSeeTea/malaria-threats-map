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

export const setDiagnosisSurveyTypes = createAction(
  ActionTypeEnum.SetSurveyTypes,
  action => {
    return (surveyTypes: string[]) => action(surveyTypes);
  }
);

export const setDiagnosisPatientType = createAction(
  ActionTypeEnum.SetPatientType,
  action => {
    return (patientType: string) => action(patientType);
  }
);
