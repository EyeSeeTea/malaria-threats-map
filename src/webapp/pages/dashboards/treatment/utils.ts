import { TreatmentStudy } from "../../../../domain/entities/TreatmentStudy";
import {
    filterByDimensionId,
    filterByDrugs,
    filterByExcludeLowerPatients,
    filterByMolecularMarker,
    filterByPlasmodiumSpecies,
    filterByYearRange,
} from "../../../components/layers/studies-filters";

export function filterStudies(
    studies: TreatmentStudy[],
    plasmodiumSpecies: string,
    drugs: string[],
    molecularMarker: number,
    years: [number, number],
    excludeLowerPatients: boolean
): TreatmentStudy[] {
    const filters = [
        filterByDimensionId(256),
        filterByPlasmodiumSpecies(plasmodiumSpecies),
        filterByDrugs(drugs || []),
        filterByYearRange(years),
        filterByMolecularMarker(molecularMarker),
        filterByExcludeLowerPatients(excludeLowerPatients),
    ];

    const filteredStudies = filters.reduce((studies, filter) => studies.filter(filter), studies);

    return filteredStudies as unknown as TreatmentStudy[];
}

export function getTreatmentFailure(study: TreatmentStudy) {
    const rawValue = parseFloat(study.TREATMENT_FAILURE_PP) || parseFloat(study.TREATMENT_FAILURE_PP) || -1;

    return +(rawValue * 100).toFixed(2);
}
