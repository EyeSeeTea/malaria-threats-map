import React from "react";
import { useState } from "react";
import { initialPreventionFilters, PreventionFiltersState } from "./PreventionFiltersState";

export function usePreventionFilters() {
    const [filters, setFilters] = useState<PreventionFiltersState>(initialPreventionFilters);

    const onInsecticideClassChange = React.useCallback(
        (values: string[]) => {
            setFilters({ ...filters, insecticideClasses: values });
        },
        [filters]
    );

    const onYearsChange = React.useCallback(
        (years: [number, number]) => {
            setFilters({ ...filters, years });
        },
        [filters]
    );

    const onOnlyIncludeBioassaysWithMoreMosquitoesChange = React.useCallback(
        (value: number) => {
            setFilters({ ...filters, onlyIncludeBioassaysWithMoreMosquitoes: value });
        },
        [filters]
    );

    const onOnlyIncludeDataByHealthChange = React.useCallback(
        (value: boolean) => {
            setFilters({ ...filters, OnlyIncludeDataByHealth: value });
        },
        [filters]
    );

    return {
        filters,
        onInsecticideClassChange,
        onYearsChange,
        onOnlyIncludeBioassaysWithMoreMosquitoesChange,
        onOnlyIncludeDataByHealthChange,
    };
}
