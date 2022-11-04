import React from "react";
import { useState } from "react";
import { MolecularMarker } from "../../../../components/filters/MolecularMarkerFilter";
import { PLASMODIUM_SPECIES_SUGGESTIONS } from "../../../../components/filters/PlasmodiumSpeciesFilter";

export function useTreatmentFilters() {
    const [plasmodiumSpecies, setPlasmodiumSpecies] = useState<string>(PLASMODIUM_SPECIES_SUGGESTIONS[0].value);
    const [drugs, setDrugs] = useState<string[]>(undefined);
    const [molecularMarker, setMolecularMarker] = useState<MolecularMarker>();
    const [years, setYears] = useState<[number, number]>([2010, new Date().getFullYear()]);
    const [excludeLowerPatients, setExcludeLowerPatients] = useState<boolean>(false);

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

    const onMolecularMarkerChange = React.useCallback((molecularMarker: MolecularMarker) => {
        setMolecularMarker(molecularMarker);
    }, []);

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
