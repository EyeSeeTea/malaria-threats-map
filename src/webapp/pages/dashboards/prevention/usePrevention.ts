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

export function usePrevention(baseFilters: ((study: PreventionStudy) => boolean)[]) {
    const filters = usePreventionFilters();

    const [filteredStudies, setFilteredStudies] = React.useState<PreventionStudy[]>([]);
    const [insecticideClassOptions, setInsecticideClassOptions] = React.useState<Option[]>([]);
    const [insecticideTypeOptions, setInsecticideTypeOptions] = React.useState<Option[]>([]);
    const [speciesOptions, setSpeciesOptions] = React.useState<Option[]>([]);
    const [typeOptions, setTypeOptions] = React.useState<Option[]>([]);
    const { preventionStudies, dashboardsPreventionStudies, selectedCountries } = useDashboards();

    React.useEffect(() => {
        const filteredStudies = filterStudies(dashboardsPreventionStudies, baseFilters, {
            insecticideClasses: filters.insecticideClasses,
            insecticideTypes: filters.insecticideTypes,
            species: filters.species,
            type: filters.type,
            onlyIncludeBioassaysWithMoreMosquitoes: filters.onlyIncludeBioassaysWithMoreMosquitoes,
            onlyIncludeDataByHealth: filters.onlyIncludeDataByHealth,
            years: filters.years,
            maxMinYears: filters.maxMinYears,
        });

        setFilteredStudies(filteredStudies);
    }, [
        baseFilters,
        dashboardsPreventionStudies,
        filters.insecticideClasses,
        filters.insecticideTypes,
        filters.maxMinYears,
        filters.onlyIncludeBioassaysWithMoreMosquitoes,
        filters.onlyIncludeDataByHealth,
        filters.species,
        filters.type,
        filters.years,
    ]);

    React.useEffect(() => {
        const filteredStudies = filterStudies(preventionStudies, baseFilters, {
            insecticideClasses: [],
            insecticideTypes: [],
            species: [],
            type: "",
            onlyIncludeBioassaysWithMoreMosquitoes: 0,
            onlyIncludeDataByHealth: false,
            years: undefined,
            maxMinYears: undefined,
        });

        const insecticideClasses = extractInsecticideClassesOptions(filteredStudies);

        setInsecticideClassOptions(insecticideClasses);
    }, [
        baseFilters,
        preventionStudies,
        filters.onlyIncludeBioassaysWithMoreMosquitoes,
        filters.onlyIncludeDataByHealth,
        filters.years,
    ]);

    React.useEffect(() => {
        const filteredStudies = filterStudies(preventionStudies, baseFilters, {
            insecticideClasses: [],
            insecticideTypes: [],
            species: [],
            type: "",
            onlyIncludeBioassaysWithMoreMosquitoes: 0,
            onlyIncludeDataByHealth: false,
            years: undefined,
            maxMinYears: undefined,
        });

        const insecticideTypes = extractInsecticideTypeOptions(filteredStudies);

        setInsecticideTypeOptions(insecticideTypes);
    }, [baseFilters, preventionStudies]);

    React.useEffect(() => {
        const filteredStudies = filterStudies(dashboardsPreventionStudies, baseFilters, {
            insecticideClasses: filters.insecticideClasses,
            insecticideTypes: [],
            species: [],
            type: "",
            onlyIncludeBioassaysWithMoreMosquitoes: 0,
            onlyIncludeDataByHealth: false,
            years: undefined,
            maxMinYears: undefined,
        });

        const species = extractSpeciesOptions(filteredStudies);

        setSpeciesOptions(species);
    }, [baseFilters, dashboardsPreventionStudies, filters.insecticideClasses]);

    React.useEffect(() => {
        const filteredStudies = filterStudies(preventionStudies, baseFilters, {
            insecticideClasses: filters.insecticideClasses,
            insecticideTypes: [],
            species: [],
            type: "",
            onlyIncludeBioassaysWithMoreMosquitoes: 0,
            onlyIncludeDataByHealth: false,
            years: undefined,
            maxMinYears: undefined,
        });

        const types = extractTypeOptions(filteredStudies);

        setTypeOptions(types);
    }, [baseFilters, preventionStudies, filters.insecticideClasses, filters.species]);

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
    };
}
