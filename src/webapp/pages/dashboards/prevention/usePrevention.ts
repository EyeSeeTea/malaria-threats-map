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
import _ from "lodash";

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
    const { dashboardsPreventionStudies, selectedCountries } = useDashboards();

    React.useEffect(() => {
        const filteredStudies = filterStudies(dashboardsPreventionStudies, filters);

        const countries = _.uniq(filteredStudies.map(s => s.ISO2));

        console.log(countries);

        setFilteredStudies(filteredStudies);
    }, [dashboardsPreventionStudies, filters]);

    React.useEffect(() => {
        const filteredStudies = filterStudies(dashboardsPreventionStudies, {
            insecticideClasses: [],
            insecticideTypes: [],
            species: [],
            type: "",
            onlyIncludeBioassaysWithMoreMosquitoes: filters.onlyIncludeBioassaysWithMoreMosquitoes,
            onlyIncludeDataByHealth: filters.onlyIncludeDataByHealth,
            years: filters.years,
        });

        const insecticideClasses = extractInsecticideClassesOptions(filteredStudies);

        setInsecticideClassOptions(insecticideClasses);
    }, [
        dashboardsPreventionStudies,
        filters.onlyIncludeBioassaysWithMoreMosquitoes,
        filters.onlyIncludeDataByHealth,
        filters.years,
    ]);

    React.useEffect(() => {
        const filteredStudies = filterStudies(dashboardsPreventionStudies, {
            insecticideClasses: [],
            insecticideTypes: [],
            species: [],
            type: "",
            onlyIncludeBioassaysWithMoreMosquitoes: filters.onlyIncludeBioassaysWithMoreMosquitoes,
            onlyIncludeDataByHealth: filters.onlyIncludeDataByHealth,
            years: filters.years,
        });

        const insecticideTypes = extractInsecticideTypeOptions(filteredStudies);

        setInsecticideTypeOptions(insecticideTypes);
    }, [
        dashboardsPreventionStudies,
        filters.onlyIncludeBioassaysWithMoreMosquitoes,
        filters.onlyIncludeDataByHealth,
        filters.years,
    ]);

    React.useEffect(() => {
        const filteredStudies = filterStudies(dashboardsPreventionStudies, {
            insecticideClasses: filters.insecticideClasses,
            insecticideTypes: [],
            species: [],
            type: "",
            onlyIncludeBioassaysWithMoreMosquitoes: filters.onlyIncludeBioassaysWithMoreMosquitoes,
            onlyIncludeDataByHealth: filters.onlyIncludeDataByHealth,
            years: filters.years,
        });

        const species = extractSpeciesOptions(filteredStudies);

        setSpeciesOptions(species);
        onSpeciesChange(species.map(option => option.value));
    }, [
        dashboardsPreventionStudies,
        filters.insecticideClasses,
        filters.onlyIncludeBioassaysWithMoreMosquitoes,
        filters.onlyIncludeDataByHealth,
        filters.years,
        onSpeciesChange,
    ]);

    React.useEffect(() => {
        const filteredStudies = filterStudies(dashboardsPreventionStudies, {
            insecticideClasses: filters.insecticideClasses,
            insecticideTypes: [],
            species: filters.species,
            type: "",
            onlyIncludeBioassaysWithMoreMosquitoes: filters.onlyIncludeBioassaysWithMoreMosquitoes,
            onlyIncludeDataByHealth: filters.onlyIncludeDataByHealth,
            years: filters.years,
        });

        const types = extractTypeOptions(filteredStudies);

        setTypeOptions(types);

        if (types.length > 0) {
            onTypeChange(types[0].value);
        }
    }, [
        dashboardsPreventionStudies,
        filters.insecticideClasses,
        filters.species,
        filters.onlyIncludeBioassaysWithMoreMosquitoes,
        filters.onlyIncludeDataByHealth,
        filters.years,
        onTypeChange,
    ]);

    return {
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
