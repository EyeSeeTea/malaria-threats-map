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

    const {
        insecticideClasses,
        insecticideTypes,
        species,
        type,
        onlyIncludeBioassaysWithMoreMosquitoes,
        onlyIncludeDataByHealth,
        years,
        maxMinYears,
    } = filters;

    React.useEffect(() => {
        const filteredStudies = filterStudies(dashboardsPreventionStudies, baseFilters, {
            insecticideClasses: insecticideClasses,
            insecticideTypes: insecticideTypes,
            species: species,
            type: type,
            onlyIncludeBioassaysWithMoreMosquitoes: onlyIncludeBioassaysWithMoreMosquitoes,
            onlyIncludeDataByHealth: onlyIncludeDataByHealth,
            years: years,
            maxMinYears: maxMinYears,
            disaggregateBySpeciesSelection: "aggregate_species",
        });

        setFilteredStudies(filteredStudies);
    }, [
        baseFilters,
        dashboardsPreventionStudies,
        insecticideClasses,
        insecticideTypes,
        maxMinYears,
        onlyIncludeBioassaysWithMoreMosquitoes,
        onlyIncludeDataByHealth,
        species,
        type,
        years,
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
            disaggregateBySpeciesSelection: "aggregate_species",
        });

        const insecticideClasses = extractInsecticideClassesOptions(filteredStudies);

        setInsecticideClassOptions(insecticideClasses);
    }, [baseFilters, preventionStudies, onlyIncludeBioassaysWithMoreMosquitoes, onlyIncludeDataByHealth, years]);

    React.useEffect(() => {
        const filteredStudies = filterStudies(preventionStudies, baseFilters, {
            insecticideClasses,
            insecticideTypes: [],
            species: [],
            type: "",
            onlyIncludeBioassaysWithMoreMosquitoes: 0,
            onlyIncludeDataByHealth: false,
            years: undefined,
            maxMinYears: undefined,
            disaggregateBySpeciesSelection: "aggregate_species",
        });

        const insecticideTypes = extractInsecticideTypeOptions(filteredStudies);

        setInsecticideTypeOptions(insecticideTypes);
    }, [baseFilters, insecticideClasses, preventionStudies]);

    React.useEffect(() => {
        const filteredStudies = filterStudies(dashboardsPreventionStudies, baseFilters, {
            insecticideClasses: insecticideClasses,
            insecticideTypes: [],
            species: [],
            type: "",
            onlyIncludeBioassaysWithMoreMosquitoes: 0,
            onlyIncludeDataByHealth: false,
            years: undefined,
            maxMinYears: undefined,
            disaggregateBySpeciesSelection: "aggregate_species",
        });

        const species = extractSpeciesOptions(filteredStudies);

        setSpeciesOptions(species);
    }, [baseFilters, dashboardsPreventionStudies, insecticideClasses]);

    React.useEffect(() => {
        const filteredStudies = filterStudies(preventionStudies, baseFilters, {
            insecticideClasses: insecticideClasses,
            insecticideTypes: [],
            species: [],
            type: "",
            onlyIncludeBioassaysWithMoreMosquitoes: 0,
            onlyIncludeDataByHealth: false,
            years: undefined,
            maxMinYears: undefined,
            disaggregateBySpeciesSelection: "aggregate_species",
        });

        const types = extractTypeOptions(filteredStudies);

        setTypeOptions(types);
    }, [baseFilters, preventionStudies, insecticideClasses, species]);

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
