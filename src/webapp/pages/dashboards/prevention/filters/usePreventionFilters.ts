import React from "react";
import { useState } from "react";
import { sortInsecticideClasses } from "../../../../components/filters/InsecticideClassFilter";
import { getMinMaxYears } from "../../../../../domain/entities/Study";
import { useDashboards } from "../../context/useDashboards";
import { PreventionFiltersState } from "./PreventionFiltersState";

export function usePreventionFilters(): PreventionFiltersState {
    const { dashboardsPreventionStudies } = useDashboards();

    const [insecticideTypes, setInsecticideTypes] = useState<string[]>([]);
    const [insecticideClasses, setInsecticideClasses] = useState<string[]>([]);
    const [species, setSpecies] = useState<string[]>([]);
    const [type, setType] = useState<string>();
    const [years, setYears] = useState<[number, number]>([2010, new Date().getFullYear()]);
    const [onlyIncludeBioassaysWithMoreMosquitoes, setOnlyIncludeBioassaysWithMoreMosquitoes] = useState<number>(0);
    const [onlyIncludeDataByHealth, setOnlyIncludeDataByHealth] = useState<boolean>(false);
    const [maxMinYears] = useState<[number, number]>(getMinMaxYears(dashboardsPreventionStudies, true));

    const onInsecticideClassChange = React.useCallback((values: string[]) => {
        setInsecticideClasses(sortInsecticideClasses(values));
    }, []);

    const onSpeciesChange = React.useCallback((values: string[]) => {
        setSpecies(values);
    }, []);

    const onInsecticideTypesChange = React.useCallback((values: string[]) => {
        setInsecticideTypes(values);
    }, []);

    const onTypeChange = React.useCallback((value: string) => {
        setType(value);
    }, []);

    const onYearsChange = React.useCallback((years: [number, number]) => {
        setYears(years);
    }, []);

    const onOnlyIncludeBioassaysWithMoreMosquitoesChange = React.useCallback((value: number) => {
        setOnlyIncludeBioassaysWithMoreMosquitoes(value);
    }, []);

    const onOnlyIncludeDataByHealthChange = React.useCallback((value: boolean) => {
        setOnlyIncludeDataByHealth(value);
    }, []);

    return {
        insecticideClasses,
        species,
        insecticideTypes,
        type,
        years,
        onlyIncludeBioassaysWithMoreMosquitoes,
        onlyIncludeDataByHealth,
        maxMinYears,
        onInsecticideClassChange,
        onSpeciesChange,
        onInsecticideTypesChange,
        onTypeChange,
        onYearsChange,
        onOnlyIncludeBioassaysWithMoreMosquitoesChange,
        onOnlyIncludeDataByHealthChange,
    };
}
