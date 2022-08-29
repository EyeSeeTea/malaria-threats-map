import React from "react";
import { useState } from "react";
import { PLASMODIUM_SPECIES_SUGGESTIONS } from "../../../../components/filters/PlasmodiumSpeciesFilter";

export function useTreatmentFilters() {
    const [plasmodiumSpecies, setPlasmodiumSpecies] = useState<string>(PLASMODIUM_SPECIES_SUGGESTIONS[0].value);
    const [drugs, setDrugs] = useState<string[]>([]);
    const [molecularMarker, setMolecularMarker] = useState<number>(0);
    const [years, setYears] = useState<[number, number]>([2010, new Date().getFullYear()]);
    const [excludeLowerPatients, setExcludeLowerPatients] = useState<boolean>(false);

    const onPlasmodiumChange = React.useCallback((value: string) => {
        setPlasmodiumSpecies(value);
    }, []);

    const onDrugsChange = (values: string[]) => {
        setDrugs(values);
    };

    const onYearsChange = (years: [number, number]) => {
        setYears(years);
    };

    const onExcludeLowerPatientsChange = (excludeLowerPatients: boolean) => {
        setExcludeLowerPatients(excludeLowerPatients);
    };

    const onMolecularMarkerChange = (molecularMarker: number) => {
        setMolecularMarker(molecularMarker);
    };

    return {
        plasmodiumSpecies,
        drugs,
        molecularMarker,
        years,
        excludeLowerPatients,
        onPlasmodiumChange,
        onDrugsChange,
        onYearsChange,
        onExcludeLowerPatientsChange,
        onMolecularMarkerChange,
    };
}
