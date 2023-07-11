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
            maxMinYears: filters.maxMinYears,
        });

        const insecticideClasses = extractInsecticideClassesOptions(filteredStudies);

        setInsecticideClassOptions(insecticideClasses);
    }, [
        preventionStudies,
        filters.onlyIncludeBioassaysWithMoreMosquitoes,
        filters.onlyIncludeDataByHealth,
        filters.years,
        filters.maxMinYears,
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
            maxMinYears: filters.maxMinYears,
        });

        const insecticideTypes = extractInsecticideTypeOptions(filteredStudies);

        setInsecticideTypeOptions(insecticideTypes);
    }, [filters.maxMinYears, preventionStudies]);

    React.useEffect(() => {
        const filteredStudies = filterStudies(dashboardsPreventionStudies, {
            insecticideClasses: filters.insecticideClasses,
            insecticideTypes: [],
            species: [],
            type: "",
            onlyIncludeBioassaysWithMoreMosquitoes: 0,
            onlyIncludeDataByHealth: false,
            years: undefined,
            maxMinYears: filters.maxMinYears,
        });

        const species = extractSpeciesOptions(filteredStudies);

        setSpeciesOptions(species);
    }, [dashboardsPreventionStudies, filters.insecticideClasses, onSpeciesChange, filters.maxMinYears]);

    React.useEffect(() => {
        const filteredStudies = filterStudies(preventionStudies, {
            insecticideClasses: filters.insecticideClasses,
            insecticideTypes: [],
            species: [],
            type: "",
            onlyIncludeBioassaysWithMoreMosquitoes: 0,
            onlyIncludeDataByHealth: false,
            years: undefined,
            maxMinYears: filters.maxMinYears,
        });

        const types = extractTypeOptions(filteredStudies);

        setTypeOptions(types);
    }, [preventionStudies, filters.insecticideClasses, filters.species, onTypeChange, filters.maxMinYears]);

    return {
        preventionStudies,
        filteredStudies,
        insecticideClassOptions,
        insecticideTypeOptions,
        selectedCountries,
        filters,
        speciesOptions,
        typeOptions,
        dashboardsPreventionStudies,
        onInsecticideClassChange,
        onSpeciesChange,
        onInsecticideTypesChange,
        onTypeChange,
        onYearsChange,
        onOnlyIncludeBioassaysWithMoreMosquitoesChange,
        onOnlyIncludeDataByHealthChange,
    };
}
