import { createAction } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import { TreatmentMapType } from "../types";
import { TreatmentStudy } from "../../../domain/entities/TreatmentStudy";

export const fetchTreatmentStudiesRequest = createAction(ActionTypeEnum.FetchTreatmentStudiesRequest)();

export const fetchTreatmentStudiesSuccess = createAction(ActionTypeEnum.FetchTreatmentStudiesSuccess)<
    TreatmentStudy[]
>();

export const fetchTreatmentStudiesError = createAction(ActionTypeEnum.FetchTreatmentStudiesError)();

export const setTreatmentMapType = createAction(ActionTypeEnum.SetTreatmentMapType)<TreatmentMapType>();

export const setTreatmentPlasmodiumSpecies = createAction(ActionTypeEnum.SetPlasmodiumSpecies)<string>();

export const setTreatmentDrug = createAction(ActionTypeEnum.SetDrug)<string>();

export const setMolecularMarker = createAction(ActionTypeEnum.SetMolecularMarker)<number>();

export const setExcludeLowerPatients = createAction(ActionTypeEnum.SetExcludeLowerPatients)<boolean>();

export const setExcludeLowerSamples = createAction(ActionTypeEnum.SetExcludeLowerSamples)<boolean>();

export const setFilteredStudiesAction = createAction(ActionTypeEnum.SetTreatmentFilteredStudies)<TreatmentStudy[]>();
