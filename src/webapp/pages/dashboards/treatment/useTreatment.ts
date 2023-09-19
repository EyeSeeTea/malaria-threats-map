import React from "react";
import { TreatmentStudy } from "../../../../domain/entities/TreatmentStudy";
import { useDashboards } from "../context/useDashboards";
import { useTreatmentFilters } from "./filters/useTreatmentFilters";
import { filterMolecularMarkerStudies, filterStudies } from "./utils";
import _ from "lodash";

export function useTreatment(drugsMulti: boolean) {
    const {
        plasmodiumSpecies,
        drugs,
        molecularMarker,
        years,
        maxMinYears,
        excludeLowerPatients,
        excludeLowerSamples,
        onPlasmodiumChange,
        onDrugsChange,
        onYearsChange,
        onExcludeLowerPatientsChange,
        onExcludeLowerSamplesChange,
        onMolecularMarkerChange,
    } = useTreatmentFilters();

    const [filteredStudies, setFilteredStudies] = React.useState<TreatmentStudy[]>([]);
    const [filteredStudiesForDrugs, setFilteredStudiesForDrugs] = React.useState<TreatmentStudy[]>([]);
    const { dashboardsTreatmentStudies, selectedCountries } = useDashboards();

    const studiesCount = React.useMemo(() => filteredStudies.length, [filteredStudies]);

    React.useEffect(() => {
        if (drugsMulti) {
            const drugUniques =
                filteredStudiesForDrugs.length > 0
                    ? _.uniq(filteredStudiesForDrugs.map(study => study.DRUG_NAME))
                    : undefined;

            if (drugUniques) {
                onDrugsChange(drugUniques);
            }
        } else {
            const drug =
                filteredStudiesForDrugs.length > 0
                    ? _.uniq(filteredStudiesForDrugs.map(study => study.DRUG_NAME))[0]
                    : undefined;

            if (drug) {
                onDrugsChange([drug]);
            }
        }
    }, [filteredStudiesForDrugs, onDrugsChange, drugsMulti]);

    React.useEffect(() => {
        if (drugsMulti) {
            const drugUniques =
                filteredStudiesForDrugs.length > 0
                    ? _.uniq(filteredStudiesForDrugs.map(study => study.DRUG_NAME))
                    : undefined;

            if (drugUniques) {
                onDrugsChange(drugUniques);
            }
        } else {
            const drug =
                filteredStudiesForDrugs.length > 0
                    ? _.uniq(filteredStudiesForDrugs.map(study => study.DRUG_NAME))[0]
                    : undefined;

            if (drug) {
                onDrugsChange([drug]);
            }
        }
    }, [plasmodiumSpecies, filteredStudiesForDrugs, onDrugsChange, drugsMulti]);

    React.useEffect(() => {
        if (molecularMarker) {
            const filteredStudies = filterMolecularMarkerStudies(
                dashboardsTreatmentStudies,
                molecularMarker,
                years,
                excludeLowerSamples
            );

            setFilteredStudies(filteredStudies);
        } else {
            const filteredStudies = filterStudies(
                dashboardsTreatmentStudies,
                plasmodiumSpecies,
                drugs,
                years,
                excludeLowerPatients
            );

            setFilteredStudies(filteredStudies);
        }
    }, [
        dashboardsTreatmentStudies,
        plasmodiumSpecies,
        drugs,
        molecularMarker,
        years,
        excludeLowerPatients,
        excludeLowerSamples,
    ]);

    React.useEffect(() => {
        const filteredStudies = filterStudies(dashboardsTreatmentStudies, plasmodiumSpecies, [], undefined, false);

        setFilteredStudiesForDrugs(filteredStudies);
    }, [dashboardsTreatmentStudies, plasmodiumSpecies]);

    return {
        filteredStudies,
        filteredStudiesForDrugs,
        selectedCountries,
        studiesCount,

        filters: {
            plasmodiumSpecies,
            drugs,
            molecularMarker,
            years,
            maxMinYears,
            excludeLowerPatients,
            excludeLowerSamples,
            onPlasmodiumChange,
            onDrugsChange,
            onYearsChange,
            onExcludeLowerPatientsChange,
            onExcludeLowerSamplesChange,
            onMolecularMarkerChange,
        },
    };
}
