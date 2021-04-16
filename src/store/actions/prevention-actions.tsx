import { createAction } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import { PreventionResponse, PreventionStudy } from "../../types/Prevention";
import { AjaxError } from "rxjs/ajax";
import { PreventionMapType } from "../types";

export const fetchPreventionStudiesRequest = createAction(ActionTypeEnum.FetchPreventionStudiesRequest, action => {
    return () => action();
});

export const fetchPreventionStudiesSuccess = createAction(ActionTypeEnum.FetchPreventionStudiesSuccess, action => {
    return (response: PreventionResponse) => action(response);
});

export const fetchPreventionStudiesError = createAction(ActionTypeEnum.FetchPreventionStudiesError, action => {
    return (error: AjaxError | string) => action();
});

export const setPreventionMapType = createAction(ActionTypeEnum.SetPreventionMapType, action => {
    return (mapType: PreventionMapType) => action(mapType);
});

export const setInsecticideClass = createAction(ActionTypeEnum.SetInsecticideClass, action => {
    return (insecticideClass: string) => action(insecticideClass);
});

export const setInsecticideTypes = createAction(ActionTypeEnum.SetInsecticideTypes, action => {
    return (insecticideTypes: string[]) => action(insecticideTypes);
});

export const setAssayTypes = createAction(ActionTypeEnum.SetAssayTypes, action => {
    return (assayTypes: string[]) => action(assayTypes);
});

export const setType = createAction(ActionTypeEnum.SetType, action => {
    return (type: string) => action(type);
});

export const setSynergistTypes = createAction(ActionTypeEnum.SetSynergistTypes, action => {
    return (type: string[]) => action(type);
});

export const setSpecies = createAction(ActionTypeEnum.SetSpecies, action => {
    return (species: string[]) => action(species);
});

export const setPreventionFilteredStudiesAction = createAction(ActionTypeEnum.SetPreventionFilteredStudies, action => {
    return (filteredStudies: PreventionStudy[]) => action(filteredStudies);
});
