import { TreatmentStudy } from "../../../../domain/entities/TreatmentStudy";
import {
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
        filterByPlasmodiumSpecies(plasmodiumSpecies),
        filterByDrugs(drugs || []),
        filterByYearRange(years),
        filterByMolecularMarker(molecularMarker),
        filterByExcludeLowerPatients(excludeLowerPatients),
    ];

    const filteredStudies = filters.reduce((studies, filter) => studies.filter(filter), studies);

    return filteredStudies as unknown as TreatmentStudy[];
}
