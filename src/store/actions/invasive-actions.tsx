import { createAction } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import { InvasiveResponse, InvasiveStudy } from "../../types/Invasive";
import { AjaxError } from "rxjs/ajax";
import { InvasiveMapType } from "../types";

export const fetchInvasiveStudiesRequest = createAction(ActionTypeEnum.FetchInvasiveStudiesRequest, action => {
    return () => action();
});
export const fetchInvasiveStudiesSuccess = createAction(ActionTypeEnum.FetchInvasiveStudiesSuccess, action => {
    return (response: InvasiveResponse) => action(response);
});
export const fetchInvasiveStudiesError = createAction(ActionTypeEnum.FetchInvasiveStudiesError, action => {
    return (_error: AjaxError | string) => action();
});

export const setInvasiveMapType = createAction(ActionTypeEnum.SetInvasiveMapType, action => {
    return (mapType: InvasiveMapType) => action(mapType);
});

export const setInvasiveVectorSpecies = createAction(ActionTypeEnum.SetInvasiveVectorSpecies, action => {
    return (vectorSpecies: string[]) => action(vectorSpecies);
});

export const setInvasiveFilteredStudiesAction = createAction(ActionTypeEnum.SetInvasiveFilteredStudies, action => {
    return (filteredStudies: InvasiveStudy[]) => action(filteredStudies);
});
