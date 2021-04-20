import {createAction} from "typesafe-actions";
import {ActionTypeEnum} from "../actions";
import {DiagnosisResponse} from "../../types/Diagnosis";
import {AjaxError} from "rxjs/ajax";
import {DiagnosisMapType} from "../types";
import {DiagnosisStudy} from "../../../domain/entities/DiagnosisStudy";

export const fetchDiagnosisStudiesRequest = createAction(
    ActionTypeEnum.FetchDiagnosisStudiesRequest,
    (action) => {
        return () => action();
    }
);
export const fetchDiagnosisStudiesSuccess = createAction(
    ActionTypeEnum.FetchDiagnosisStudiesSuccess,
    (action) => {
        return (response: DiagnosisResponse) => action(response);
    }
);
export const fetchDiagnosisStudiesError = createAction(
    ActionTypeEnum.FetchDiagnosisStudiesError,
    (action) => {
        return (error: AjaxError | string) => action();
    }
);

export const setDiagnosisSurveyTypes = createAction(ActionTypeEnum.SetSurveyTypes, (action) => {
    return (surveyTypes: string[]) => action(surveyTypes);
});

export const setDiagnosisPatientType = createAction(ActionTypeEnum.SetPatientType, (action) => {
    return (patientType: string) => action(patientType);
});

export const setDiagnosisMapType = createAction(ActionTypeEnum.SetDiagnosisMapType, (action) => {
    return (mapType: DiagnosisMapType) => action(mapType);
});

export const setDiagnosisDeletionType = createAction(ActionTypeEnum.SetDeletionType, (action) => {
    return (deletionType: string) => action(deletionType);
});

export const setDiagnosisFilteredStudiesAction = createAction(
    ActionTypeEnum.SetDiagnosisFilteredStudies,
    (action) => {
        return (filteredStudies: DiagnosisStudy[]) => action(filteredStudies);
    }
);
