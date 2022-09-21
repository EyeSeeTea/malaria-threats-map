import React from "react";
import { useDashboards } from "../context/useDashboards";
import { usePreventionFilters } from "./filters/usePreventionFilters";
import { filterStudies } from "./utils";
import { PreventionStudy } from "../../../../domain/entities/PreventionStudy";

export function usePrevention() {
    const {
        filters,
        onInsecticideClassChange,
        onYearsChange,
        onOnlyIncludeBioassaysWithMoreMosquitoesChange,
        onOnlyIncludeDataByHealthChange,
    } = usePreventionFilters();

    const [filteredStudies, setFilteredStudies] = React.useState<PreventionStudy[]>([]);
    const { dashboardsPreventionStudies, selectedCountries } = useDashboards();

    React.useEffect(() => {
        const filteredStudies = filterStudies(dashboardsPreventionStudies, filters);

        setFilteredStudies(filteredStudies);
    }, [dashboardsPreventionStudies, filters]);

    return {
        filteredStudies,
        selectedCountries,
        filters,
        onInsecticideClassChange,
        onYearsChange,
        onOnlyIncludeBioassaysWithMoreMosquitoesChange,
        onOnlyIncludeDataByHealthChange,
    };
}
