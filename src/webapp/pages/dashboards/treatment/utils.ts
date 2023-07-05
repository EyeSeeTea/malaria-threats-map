import _ from "lodash";
import { TreatmentStudy } from "../../../../domain/entities/TreatmentStudy";
import {
    filterByDimensionId,
    filterByDrugs,
    filterByExcludeLowerPatients,
    filterByExcludeLowerSamples,
    filterByMolecularMarker,
    filterByMolecularMarkerStudy,
    filterByPlasmodiumSpecie,
    filterByYearRange,
} from "../../../components/layers/studies-filters";

export function filterStudies(
    studies: TreatmentStudy[],
    plasmodiumSpecie: string,
    drugs: string[],
    years: [number, number],
    excludeLowerPatients: boolean
): TreatmentStudy[] {
    const filters = _.compact([
        filterByDimensionId(256),
        filterByPlasmodiumSpecie(plasmodiumSpecie),
        filterByDrugs(drugs || []),
        years && filterByYearRange(years),
        filterByExcludeLowerPatients(excludeLowerPatients),
    ]);

    const filteredStudies = filters.reduce((studies, filter) => studies.filter(filter), studies);

    return filteredStudies as unknown as TreatmentStudy[];
}

export function filterMolecularMarkerStudies(
    studies: TreatmentStudy[],
    molecularMarker: number,
    years: [number, number],
    excludeLowerSamples: boolean
): TreatmentStudy[] {
    const filters = [
        filterByMolecularMarkerStudy(),
        filterByMolecularMarker(molecularMarker),
        filterByYearRange(years),
        filterByExcludeLowerSamples(excludeLowerSamples),
    ];

    const filteredStudies = filters.reduce((studies, filter) => studies.filter(filter), studies);

    return filteredStudies as unknown as TreatmentStudy[];
}

export function getTreatmentFailure(study: TreatmentStudy) {
    const rawValue = parseFloat(study.TREATMENT_FAILURE_PP) || parseFloat(study.TREATMENT_FAILURE_PP) || -1;

    return +(rawValue * 100).toFixed(2);
}
