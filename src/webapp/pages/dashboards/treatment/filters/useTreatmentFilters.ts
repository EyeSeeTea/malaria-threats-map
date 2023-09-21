import React from "react";
import { useState } from "react";
import { MolecularMarker } from "../../../../components/filters/MolecularMarkerRadioFilter";
import { PLASMODIUM_SPECIES_SUGGESTIONS } from "../../../../components/filters/PlasmodiumSpeciesFilter";
import { getMinMaxYears } from "../../../../../domain/entities/Study";
import { useDashboards } from "../../context/useDashboards";

export function useTreatmentFilters() {
    const { dashboardsTreatmentStudies } = useDashboards();

    const [plasmodiumSpecies, setPlasmodiumSpecies] = useState<string>(PLASMODIUM_SPECIES_SUGGESTIONS[0].value);
    const [drugs, setDrugs] = useState<string[]>(undefined);
    const [molecularMarker, setMolecularMarker] = useState<MolecularMarker>();
    const [years, setYears] = useState<[number, number]>([2015, new Date().getFullYear()]);
    const [excludeLowerPatients, setExcludeLowerPatients] = useState<boolean>(false);
    const [excludeLowerSamples, setExcludeLowerSamples] = useState<boolean>(false);
    const [maxMinYears] = useState<[number, number]>(getMinMaxYears(dashboardsTreatmentStudies));

    const onPlasmodiumChange = React.useCallback((value: string) => {
        setPlasmodiumSpecies(value);
    }, []);

    const onDrugsChange = React.useCallback((values: string[]) => {
        setDrugs(values);
    }, []);

    const onYearsChange = React.useCallback((years: [number, number]) => {
        setYears(years);
    }, []);

    const onExcludeLowerPatientsChange = React.useCallback((excludeLowerPatients: boolean) => {
        setExcludeLowerPatients(excludeLowerPatients);
    }, []);

    const onExcludeLowerSamplesChange = React.useCallback((excludeLowerSamples: boolean) => {
        setExcludeLowerSamples(excludeLowerSamples);
    }, []);

    const onMolecularMarkerChange = React.useCallback((molecularMarker: MolecularMarker) => {
        setMolecularMarker(molecularMarker);
    }, []);

    return {
        plasmodiumSpecies,
        drugs,
        molecularMarker,
        years,
        maxMinYears: [maxMinYears[0], new Date().getFullYear()] as [number, number],
        excludeLowerPatients,
        excludeLowerSamples,
        onPlasmodiumChange,
        onDrugsChange,
        onYearsChange,
        onExcludeLowerPatientsChange,
        onExcludeLowerSamplesChange,
        onMolecularMarkerChange,
    };
}
