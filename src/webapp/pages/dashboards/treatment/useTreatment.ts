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
        showDataForAllCountries,
        onPlasmodiumChange,
        onDrugsChange,
        onYearsChange,
        onExcludeLowerPatientsChange,
        onExcludeLowerSamplesChange,
        onMolecularMarkerChange,
        onChangeShowDataForAllCountries,
    } = useTreatmentFilters();

    const [filteredStudies, setFilteredStudies] = React.useState<TreatmentStudy[]>([]);
    const [filteredStudiesForDrugs, setFilteredStudiesForDrugs] = React.useState<TreatmentStudy[]>([]);
    const { dashboardsTreatmentStudies, selectedCountries, treatmentStudies } = useDashboards();

    const studiesCount = React.useMemo(() => filteredStudies.length, [filteredStudies]);

    const studies = React.useMemo(
        () => (showDataForAllCountries === "all" ? treatmentStudies : dashboardsTreatmentStudies),
        [showDataForAllCountries, treatmentStudies, dashboardsTreatmentStudies]
    );

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
            const filteredStudies = filterStudies(studies, plasmodiumSpecies, drugs, years, excludeLowerPatients);

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
        studies,
    ]);

    React.useEffect(() => {
        const filteredStudies = filterStudies(studies, plasmodiumSpecies, [], undefined, false);

        setFilteredStudiesForDrugs(filteredStudies);
    }, [studies, plasmodiumSpecies]);

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
            showDataForAllCountries,
            onPlasmodiumChange,
            onDrugsChange,
            onYearsChange,
            onExcludeLowerPatientsChange,
            onExcludeLowerSamplesChange,
            onMolecularMarkerChange,
            onChangeShowDataForAllCountries,
        },
    };
}
