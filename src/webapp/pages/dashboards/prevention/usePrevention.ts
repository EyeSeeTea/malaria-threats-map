import React from "react";
import { useDashboards } from "../context/useDashboards";
import { usePreventionFilters } from "./filters/usePreventionFilters";
import { filterStudies } from "./utils";
import { PreventionStudy } from "../../../../domain/entities/PreventionStudy";

export function usePrevention() {
    const {
        filters,
        onInsecticideClassChange,
        onInsecticideTypesChange,
        onYearsChange,
        onOnlyIncludeBioassaysWithMoreMosquitoesChange,
        onOnlyIncludeDataByHealthChange,
    } = usePreventionFilters();

    const [filteredStudies, setFilteredStudies] = React.useState<PreventionStudy[]>([]);
    const [filteredStudiesForInsecticide, setFilteredStudiesForInsecticide] = React.useState<PreventionStudy[]>([]);
    const { dashboardsPreventionStudies, selectedCountries } = useDashboards();

    React.useEffect(() => {
        const filteredStudies = filterStudies(dashboardsPreventionStudies, filters);

        setFilteredStudies(filteredStudies);
    }, [dashboardsPreventionStudies, filters]);

    React.useEffect(() => {
        const filteredStudies = filterStudies(dashboardsPreventionStudies, {
            insecticideClasses: [],
            insecticideTypes: [],
            onlyIncludeBioassaysWithMoreMosquitoes: filters.onlyIncludeBioassaysWithMoreMosquitoes,
            onlyIncludeDataByHealth: filters.onlyIncludeDataByHealth,
            years: filters.years,
        });

        setFilteredStudiesForInsecticide(filteredStudies);
    }, [
        dashboardsPreventionStudies,
        filters.onlyIncludeBioassaysWithMoreMosquitoes,
        filters.onlyIncludeDataByHealth,
        filters.years,
    ]);

    return {
        filteredStudies,
        filteredStudiesForInsecticide,
        selectedCountries,
        filters,
        onInsecticideClassChange,
        onInsecticideTypesChange,
        onYearsChange,
        onOnlyIncludeBioassaysWithMoreMosquitoesChange,
        onOnlyIncludeDataByHealthChange,
    };
}
