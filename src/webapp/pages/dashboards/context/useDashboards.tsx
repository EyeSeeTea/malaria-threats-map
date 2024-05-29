import { useContext, useCallback } from "react";
import { DashboardsThemeOptions } from "../types";
import { DashboardContext } from "./DashboardProvider";
import { sendAnalytics } from "../../../utils/analytics";

export const useDashboards = () => {
    const {
        theme,
        selectedCountries,
        preventionStudies,
        treatmentStudies,
        dashboardsPreventionStudies,
        dashboardsTreatmentStudies,
        updatedDates,
        setTheme,
        setSelectedCountries,
        setDashboardsPreventionStudies,
        setDashboardsTreatmentStudies,
    } = useContext(DashboardContext);

    const onThemeChange = useCallback(
        (theme: DashboardsThemeOptions) => {
            setTheme(theme);

            if (!theme) {
                setDashboardsTreatmentStudies(undefined);
            }
        },
        [setTheme, setDashboardsTreatmentStudies]
    );

    const onSelectedCountriesChange = useCallback(
        (selectedCountries: string[]) => {
            if (selectedCountries.length <= 5) {
                setSelectedCountries(selectedCountries);

                if (selectedCountries.length === 0) {
                    setDashboardsTreatmentStudies(undefined);
                }
            }
        },
        [setSelectedCountries, setDashboardsTreatmentStudies]
    );

    const onGenerate = useCallback(() => {
        sendAnalytics({
            type: "event",
            category: "dashboards",
            action: "generate",
            label: `Theme: ${theme}; Selected countries: ${selectedCountries.join(", ")}`,
        });
        if (theme === "prevention") {
            const dashboardStudies = preventionStudies.filter(
                study => selectedCountries.includes(study.ISO2) || selectedCountries.length === 0
            );

            setDashboardsPreventionStudies(dashboardStudies);
        } else {
            const dashboardStudies = treatmentStudies.filter(
                study => selectedCountries.includes(study.ISO2) || selectedCountries.length === 0
            );

            setDashboardsTreatmentStudies(dashboardStudies);
        }
    }, [
        theme,
        selectedCountries,
        preventionStudies,
        treatmentStudies,
        setDashboardsPreventionStudies,
        setDashboardsTreatmentStudies,
    ]);

    return {
        theme,
        selectedCountries,
        preventionStudies,
        treatmentStudies,
        dashboardsTreatmentStudies,
        dashboardsPreventionStudies,
        updatedDates,
        onThemeChange,
        onSelectedCountriesChange,
        onGenerate,
    };
};
