import { createAction } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import { PreventionMapType } from "../types";
import { PreventionStudy } from "../../../domain/entities/PreventionStudy";

export const fetchPreventionStudiesRequest = createAction(ActionTypeEnum.FetchPreventionStudiesRequest)();
export const fetchPreventionStudiesError = createAction(ActionTypeEnum.FetchPreventionStudiesError)();

export const fetchResistanceStatusTypeStudiesRequest = createAction(
    ActionTypeEnum.FetchResistanceStatusTypeStudiesRequest
)();
export const fetchResistanceStatusTypeStudiesSuccess = createAction(
    ActionTypeEnum.FetchResistanceStatusTypeStudiesSuccess
)<PreventionStudy[]>();
export const fetchResistanceStatusTypeStudiesError = createAction(
    ActionTypeEnum.FetchResistanceStatusTypeStudiesError
)();

export const fetchResistanceIntensityTypeStudiesRequest = createAction(
    ActionTypeEnum.FetchResistanceIntensityTypeStudiesRequest
)();
export const fetchResistanceIntensityTypeStudiesSuccess = createAction(
    ActionTypeEnum.FetchResistanceIntensityTypeStudiesSuccess
)<PreventionStudy[]>();
export const fetchResistanceIntensityTypeStudiesError = createAction(
    ActionTypeEnum.FetchResistanceIntensityTypeStudiesError
)();

export const fetchResistanceMechanismTypeStudiesRequest = createAction(
    ActionTypeEnum.FetchResistanceMechanismTypeStudiesRequest
)();
export const fetchResistanceMechanismTypeStudiesSuccess = createAction(
    ActionTypeEnum.FetchResistanceMechanismTypeStudiesSuccess
)<PreventionStudy[]>();
export const fetchResistanceMechanismTypeStudiesError = createAction(
    ActionTypeEnum.FetchResistanceMechanismTypeStudiesError
)();

export const fetchSynergistEffectTypeStudiesRequest = createAction(
    ActionTypeEnum.FetchSynergistEffectTypeStudiesRequest
)();
export const fetchSynergistEffectTypeStudiesSuccess = createAction(
    ActionTypeEnum.FetchSynergistEffectTypeStudiesSuccess
)<PreventionStudy[]>();
export const fetchSynergistEffectTypeStudiesError = createAction(ActionTypeEnum.FetchSynergistEffectTypeStudiesError)();

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
