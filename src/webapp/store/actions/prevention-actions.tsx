import { createAction } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import { PreventionMapType } from "../types";
import { PreventionStudy } from "../../../domain/entities/PreventionStudy";

export const fetchPreventionStudiesRequest = createAction(ActionTypeEnum.FetchPreventionStudiesRequest)();

export const fetchPreventionStudiesSuccess = createAction(ActionTypeEnum.FetchPreventionStudiesSuccess)<
    PreventionStudy[]
>();

export const fetchPreventionStudiesError = createAction(ActionTypeEnum.FetchPreventionStudiesError)();

export const setPreventionMapType = createAction(ActionTypeEnum.SetPreventionMapType)<PreventionMapType | null>();

export const setPreventionDataset = createAction(ActionTypeEnum.SetPreventionDataset)<string | null>();

export const setInsecticideClass = createAction(ActionTypeEnum.SetInsecticideClass)<string>();

export const setInsecticideTypes = createAction(ActionTypeEnum.SetInsecticideTypes)<string[]>();

export const setAssayTypes = createAction(ActionTypeEnum.SetAssayTypes)<string[]>();

export const setType = createAction(ActionTypeEnum.SetType)<string[]>();

export const setProxyType = createAction(ActionTypeEnum.SetProxyType)<string>();

export const setSynergistTypes = createAction(ActionTypeEnum.SetSynergistTypes)<string[]>();

export const setSpecies = createAction(ActionTypeEnum.SetSpecies)<string[]>();

export const setPreventionFilteredStudies = createAction(ActionTypeEnum.SetPreventionFilteredStudies)<
    PreventionStudy[]
>();

export const setOnlyByHealthMinistries = createAction(ActionTypeEnum.SetOnlyByHealthMinistries)<boolean>();
export const setOnlyIncludeBioassaysWithMoreMosquitoes = createAction(
    ActionTypeEnum.SetOnlyIncludeBioassaysWithMoreMosquitoes
)<number>();
