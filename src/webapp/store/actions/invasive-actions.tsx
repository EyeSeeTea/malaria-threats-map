import { createAction } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import { InvasiveMapType } from "../types";
import { InvasiveStudy } from "../../../domain/entities/InvasiveStudy";

export const fetchInvasiveStudiesRequest = createAction(ActionTypeEnum.FetchInvasiveStudiesRequest, action => {
    return () => action();
});
export const fetchInvasiveStudiesSuccess = createAction(
    ActionTypeEnum.FetchInvasiveStudiesSuccess,
    action => (studies: InvasiveStudy[]) => action(studies)
);

export const fetchInvasiveStudiesError = createAction(ActionTypeEnum.FetchInvasiveStudiesError, action => () =>
    action()
);

export const setInvasiveMapType = createAction(ActionTypeEnum.SetInvasiveMapType, action => {
    return (mapType: InvasiveMapType) => action(mapType);
});

export const setInvasiveVectorSpecies = createAction(ActionTypeEnum.SetInvasiveVectorSpecies, action => {
    return (vectorSpecies: string[]) => action(vectorSpecies);
});

export const setInvasiveFilteredStudiesAction = createAction(ActionTypeEnum.SetInvasiveFilteredStudies, action => {
    return (filteredStudies: InvasiveStudy[]) => action(filteredStudies);
});
