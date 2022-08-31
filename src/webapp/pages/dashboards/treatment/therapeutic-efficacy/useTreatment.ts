import React from "react";
import { TreatmentStudy } from "../../../../../domain/entities/TreatmentStudy";
import { useDashboards } from "../../context/useDashboards";
import { useTreatmentFilters } from "../filters/useTreatmentFilters";
import { filterStudies } from "../utils";
import _ from "lodash";

export function useTreatment() {
    const {
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
    } = useTreatmentFilters();

    const [filteredStudies, setFilteredStudies] = React.useState<TreatmentStudy[]>([]);
    const [filteredStudiesForDrugs, setFilteredStudiesForDrugs] = React.useState<TreatmentStudy[]>([]);
    const { dashboardsTreatmentStudies, selectedCountries } = useDashboards();

    const studiesCount = React.useMemo(() => filteredStudies.length, [filteredStudies]);

    React.useEffect(() => {
        const drugUniques = _.uniq(filteredStudiesForDrugs.map(study => study.DRUG_NAME))[0];

        if (drugUniques) {
            onDrugsChange([drugUniques]);
        }
    }, [filteredStudiesForDrugs, onDrugsChange]);

    React.useEffect(() => {
        const filteredStudies = filterStudies(
            dashboardsTreatmentStudies,
            plasmodiumSpecies,
            drugs,
            molecularMarker,
            years,
            excludeLowerPatients
        );

        setFilteredStudies(filteredStudies);
    }, [dashboardsTreatmentStudies, plasmodiumSpecies, drugs, molecularMarker, years, excludeLowerPatients]);

    React.useEffect(() => {
        const filteredStudies = filterStudies(
            dashboardsTreatmentStudies,
            plasmodiumSpecies,
            [],
            molecularMarker,
            years,
            excludeLowerPatients
        );

        setFilteredStudiesForDrugs(filteredStudies);
    }, [dashboardsTreatmentStudies, plasmodiumSpecies, molecularMarker, years, excludeLowerPatients]);

    return {
        filteredStudies,
        filteredStudiesForDrugs,
        selectedCountries,
        studiesCount,
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
