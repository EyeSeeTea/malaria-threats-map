import { useContext, useCallback } from "react";
import { DashboardsThemeOptions } from "../types";
import { DashboardContext } from "./DashboardProvider";

export const useDashboards = () => {
    const {
        theme,
        selectedCountries,
        treatmentStudies,
        dashboardsTreatmentStudies,
        updatedDates,
        setTheme,
        setSelectedCountries,
        setDashboardsTreatmentStudies,
    } = useContext(DashboardContext);

    const onThemeChange = useCallback(
        (theme: DashboardsThemeOptions) => {
            setTheme(theme);
        },
        [setTheme]
    );

    const onSelectedCountriesChange = useCallback(
        (selectedCountries: string[]) => {
            if (selectedCountries.length <= 5) {
                setSelectedCountries(selectedCountries);
            }
        },
        [setSelectedCountries]
    );

    const onGenerate = useCallback(() => {
        const dashboardStudies = treatmentStudies.filter(
            study => selectedCountries.includes(study.ISO2) || selectedCountries.length === 0
        );

        setDashboardsTreatmentStudies(dashboardStudies);
    }, [selectedCountries, setDashboardsTreatmentStudies, treatmentStudies]);

    return {
        theme,
        selectedCountries,
        dashboardsTreatmentStudies,
        updatedDates,
        onThemeChange,
        onSelectedCountriesChange,
        onGenerate,
    };
};
