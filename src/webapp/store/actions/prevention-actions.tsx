import { createAction } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import { PreventionMapType, PreventionSelectionData } from "../types";
import { PreventionStudy } from "../../../domain/entities/PreventionStudy";
import { Option } from "../../components/BasicSelect";

export const fetchPreventionStudiesRequest = createAction(ActionTypeEnum.FetchPreventionStudiesRequest)();

export const fetchPreventionStudiesSuccess = createAction(ActionTypeEnum.FetchPreventionStudiesSuccess)<
    PreventionStudy[]
>();

export const fetchPreventionStudiesError = createAction(ActionTypeEnum.FetchPreventionStudiesError)();

export const setPreventionMapType = createAction(ActionTypeEnum.SetPreventionMapType)<PreventionMapType>();

export const setInsecticideClass = createAction(ActionTypeEnum.SetInsecticideClass)<string>();

export const setInsecticideTypes = createAction(ActionTypeEnum.SetInsecticideTypes)<string[]>();

export const setAssayTypes = createAction(ActionTypeEnum.SetAssayTypes)<string[]>();

export const setType = createAction(ActionTypeEnum.SetType)<string>();

export const setSynergistTypes = createAction(ActionTypeEnum.SetSynergistTypes)<string[]>();

export const setSpecies = createAction(ActionTypeEnum.SetSpecies)<string[]>();

export const setPreventionFilteredStudies = createAction(ActionTypeEnum.SetPreventionFilteredStudies)<
    PreventionStudy[]
>();

export const setPreventionSelectionStudies = createAction(ActionTypeEnum.SetPreventionSelectionStudies)<
    PreventionStudy[]
>();

export const setPreventionSelectionData = createAction(
    ActionTypeEnum.SetPreventionSelectionData
)<PreventionSelectionData>();

export const setPreventionSelectionDataSpecies = createAction(
    ActionTypeEnum.SetPreventionSelectionDataSpeciesSelection
)<Option[]>();
