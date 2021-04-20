import {createAction} from "typesafe-actions";
import {ActionTypeEnum} from "../actions";
import {TreatmentResponse} from "../../types/Treatment";
import {AjaxError} from "rxjs/ajax";
import {TreatmentMapType} from "../types";
import {TreatmentStudy} from "../../../domain/entities/TreatmentStudy";

export const fetchTreatmentStudiesRequest = createAction(
    ActionTypeEnum.FetchTreatmentStudiesRequest,
    (action) => {
        return () => action();
    }
);
export const fetchTreatmentStudiesSuccess = createAction(
    ActionTypeEnum.FetchTreatmentStudiesSuccess,
    (action) => {
        return (response: TreatmentResponse) => action(response);
    }
);
export const fetchTreatmentStudiesError = createAction(
    ActionTypeEnum.FetchTreatmentStudiesError,
    (action) => {
        return (error: AjaxError | string) => action();
    }
);

export const setTreatmentMapType = createAction(ActionTypeEnum.SetTreatmentMapType, (action) => {
    return (mapType: TreatmentMapType) => action(mapType);
});

export const setTreatmentPlasmodiumSpecies = createAction(
    ActionTypeEnum.SetPlasmodiumSpecies,
    (action) => {
        return (plasmodiumSpecies: string) => action(plasmodiumSpecies);
    }
);

export const setTreatmentDrug = createAction(ActionTypeEnum.SetDrug, (action) => {
    return (drug: string) => action(drug);
});

export const setMolecularMarker = createAction(ActionTypeEnum.SetMolecularMarker, (action) => {
    return (molecularMarker: number) => action(molecularMarker);
});

export const setFilteredStudiesAction = createAction(
    ActionTypeEnum.SetTreatmentFilteredStudies,
    (action) => {
        return (filteredStudies: TreatmentStudy[]) => action(filteredStudies);
    }
);
