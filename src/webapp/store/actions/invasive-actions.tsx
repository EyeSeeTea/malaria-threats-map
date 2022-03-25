import { createAction } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import { InvasiveMapType } from "../types";
import { InvasiveStudy } from "../../../domain/entities/InvasiveStudy";

export const fetchInvasiveStudiesRequest = createAction(ActionTypeEnum.FetchInvasiveStudiesRequest)();

export const fetchInvasiveStudiesSuccess = createAction(ActionTypeEnum.FetchInvasiveStudiesSuccess)<InvasiveStudy[]>();

export const fetchInvasiveStudiesError = createAction(ActionTypeEnum.FetchInvasiveStudiesError)();

export const setInvasiveMapType = createAction(ActionTypeEnum.SetInvasiveMapType)<InvasiveMapType>();

export const setInvasiveVectorSpecies = createAction(ActionTypeEnum.SetInvasiveVectorSpecies)<string[]>();

export const setInvasiveFilteredStudiesAction = createAction(ActionTypeEnum.SetInvasiveFilteredStudies)<
    InvasiveStudy[]
>();

export const setInvasiveStudySelection = createAction(ActionTypeEnum.SetInvasiveStudySelection)<
    InvasiveStudy[]
>();