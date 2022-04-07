import { createAction } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import { DiagnosisMapType } from "../types";
import { DiagnosisStudy } from "../../../domain/entities/DiagnosisStudy";

export const fetchDiagnosisStudiesRequest = createAction(ActionTypeEnum.FetchDiagnosisStudiesRequest)();

export const fetchDiagnosisStudiesSuccess = createAction(ActionTypeEnum.FetchDiagnosisStudiesSuccess)<
    DiagnosisStudy[]
>();

export const fetchDiagnosisStudiesError = createAction(ActionTypeEnum.FetchDiagnosisStudiesError)();

export const setDiagnosisSurveyTypes = createAction(ActionTypeEnum.SetSurveyTypes)<string[]>();

export const setDiagnosisPatientType = createAction(ActionTypeEnum.SetPatientType)<string>();

export const setDiagnosisMapType = createAction(ActionTypeEnum.SetDiagnosisMapType)<DiagnosisMapType>();

export const setDiagnosisDeletionType = createAction(ActionTypeEnum.SetDeletionType)<string>();

export const setDiagnosisFilteredStudiesAction = createAction(ActionTypeEnum.SetDiagnosisFilteredStudies)<
    DiagnosisStudy[]
>();

export const setDiagnosisStudySelection = createAction(ActionTypeEnum.SetDiagnosisStudySelection)<DiagnosisStudy[]>();
