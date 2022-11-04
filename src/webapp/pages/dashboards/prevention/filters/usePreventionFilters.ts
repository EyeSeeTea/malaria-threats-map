import React from "react";
import { useState } from "react";

export function usePreventionFilters() {
    const [insecticideTypes, setInsecticideTypes] = useState<string[]>([]);
    const [insecticideClasses, setInsecticideClasses] = useState<string[]>([]);
    const [species, setSpecies] = useState<string[]>([]);
    const [type, setType] = useState<string>();
    const [years, setYears] = useState<[number, number]>([2010, new Date().getFullYear()]);
    const [onlyIncludeBioassaysWithMoreMosquitoes, setOnlyIncludeBioassaysWithMoreMosquitoes] = useState<number>(0);
    const [onlyIncludeDataByHealth, setOnlyIncludeDataByHealth] = useState<boolean>(false);

    const onInsecticideClassChange = React.useCallback((values: string[]) => {
        setInsecticideClasses(values);
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

    const filters = React.useMemo(() => {
        return {
            insecticideClasses,
            species,
            insecticideTypes,
            type,
            years,
            onlyIncludeBioassaysWithMoreMosquitoes,
            onlyIncludeDataByHealth,
        };
    }, [
        insecticideClasses,
        species,
        insecticideTypes,
        type,
        years,
        onlyIncludeBioassaysWithMoreMosquitoes,
        onlyIncludeDataByHealth,
    ]);

    return {
        filters,
        onInsecticideClassChange,
        onSpeciesChange,
        onInsecticideTypesChange,
        onTypeChange,
        onYearsChange,
        onOnlyIncludeBioassaysWithMoreMosquitoesChange,
        onOnlyIncludeDataByHealthChange,
    };
}
