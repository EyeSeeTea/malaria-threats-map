import React from "react";
import { useDashboards } from "../context/useDashboards";
import { usePreventionFilters } from "./filters/usePreventionFilters";
import { filterStudies } from "./utils";
import {
    extractInsecticideClassesOptions,
    extractInsecticideTypeOptions,
    extractSpeciesOptions,
    extractTypeOptions,
    PreventionStudy,
} from "../../../../domain/entities/PreventionStudy";
import { Option } from "../../../components/BasicSelect";

export function usePrevention() {
    const {
        filters,
        onInsecticideClassChange,
        onSpeciesChange,
        onInsecticideTypesChange,
        onTypeChange,
        onYearsChange,
        onOnlyIncludeBioassaysWithMoreMosquitoesChange,
        onOnlyIncludeDataByHealthChange,
    } = usePreventionFilters();

    const [filteredStudies, setFilteredStudies] = React.useState<PreventionStudy[]>([]);
    const [insecticideClassOptions, setInsecticideClassOptions] = React.useState<Option[]>([]);
    const [insecticideTypeOptions, setInsecticideTypeOptions] = React.useState<Option[]>([]);
    const [speciesOptions, setSpeciesOptions] = React.useState<Option[]>([]);
    const [typeOptions, setTypeOptions] = React.useState<Option[]>([]);
    const { preventionStudies, dashboardsPreventionStudies, selectedCountries } = useDashboards();

    React.useEffect(() => {
        const filteredStudies = filterStudies(dashboardsPreventionStudies, filters);

        setFilteredStudies(filteredStudies);
    }, [dashboardsPreventionStudies, filters]);

    React.useEffect(() => {
        const filteredStudies = filterStudies(preventionStudies, {
            insecticideClasses: [],
            insecticideTypes: [],
            species: [],
            type: "",
            onlyIncludeBioassaysWithMoreMosquitoes: 0,
            onlyIncludeDataByHealth: false,
            years: undefined,
        });

        const insecticideClasses = extractInsecticideClassesOptions(filteredStudies);

        setInsecticideClassOptions(insecticideClasses);
    }, [
        preventionStudies,
        filters.onlyIncludeBioassaysWithMoreMosquitoes,
        filters.onlyIncludeDataByHealth,
        filters.years,
    ]);

    React.useEffect(() => {
        const filteredStudies = filterStudies(preventionStudies, {
            insecticideClasses: [],
            insecticideTypes: [],
            species: [],
            type: "",
            onlyIncludeBioassaysWithMoreMosquitoes: 0,
            onlyIncludeDataByHealth: false,
            years: undefined,
        });

        const insecticideTypes = extractInsecticideTypeOptions(filteredStudies);

        setInsecticideTypeOptions(insecticideTypes);
    }, [preventionStudies]);

    React.useEffect(() => {
        const filteredStudies = filterStudies(preventionStudies, {
            insecticideClasses: filters.insecticideClasses,
            insecticideTypes: [],
            species: [],
            type: "",
            onlyIncludeBioassaysWithMoreMosquitoes: 0,
            onlyIncludeDataByHealth: false,
            years: undefined,
        });

        const species = extractSpeciesOptions(filteredStudies);

        setSpeciesOptions(species);
    }, [preventionStudies, filters.insecticideClasses, onSpeciesChange]);

    React.useEffect(() => {
        const filteredStudies = filterStudies(preventionStudies, {
            insecticideClasses: filters.insecticideClasses,
            insecticideTypes: [],
            species: [],
            type: "",
            onlyIncludeBioassaysWithMoreMosquitoes: 0,
            onlyIncludeDataByHealth: false,
            years: undefined,
        });

        const types = extractTypeOptions(filteredStudies);

        setTypeOptions(types);
    }, [preventionStudies, filters.insecticideClasses, filters.species, onTypeChange]);

    return {
        preventionStudies,
        filteredStudies,
        insecticideClassOptions,
        insecticideTypeOptions,
        selectedCountries,
        filters,
        speciesOptions,
        typeOptions,
        onInsecticideClassChange,
        onSpeciesChange,
        onInsecticideTypesChange,
        onTypeChange,
        onYearsChange,
        onOnlyIncludeBioassaysWithMoreMosquitoesChange,
        onOnlyIncludeDataByHealthChange,
    };
}
