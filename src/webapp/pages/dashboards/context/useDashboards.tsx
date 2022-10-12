import { useContext, useCallback } from "react";
import { CountryContext, DashboardsThemeOptions, MolecularMarker, TherapeuticEfficacy } from "../types";
import { DashboardContext } from "./DashboardProvider";

export const useDashboards = () => {
    const {
        theme,
        selectedCountries,
        countryContext,
        therapeuticEfficacy,
        molecularMarker,
        treatmentStudies,
        dashboardsTreatmentStudies,
        updatedDates,
        setTheme,
        setSelectedCountries,
        setCountryContext,
        setTherapeuticEfficacy,
        setMolecularMarker,
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

    const onCountryContextChange = useCallback(
        (countryContext: CountryContext) => {
            setCountryContext(countryContext);
        },
        [setCountryContext]
    );

    const onTherapeuticEfficacyChange = useCallback(
        (therapeuticEfficacy: TherapeuticEfficacy) => {
            setTherapeuticEfficacy(therapeuticEfficacy);
        },
        [setTherapeuticEfficacy]
    );

    const onMolecularMarkerChange = useCallback(
        (molecularMarker: MolecularMarker) => {
            setMolecularMarker(molecularMarker);
        },
        [setMolecularMarker]
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
        countryContext,
        therapeuticEfficacy,
        molecularMarker,
        dashboardsTreatmentStudies,
        updatedDates,
        onThemeChange,
        onSelectedCountriesChange,
        onCountryContextChange,
        onTherapeuticEfficacyChange,
        onMolecularMarkerChange,
        onGenerate,
    };
};
