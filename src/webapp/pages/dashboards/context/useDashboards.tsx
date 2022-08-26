import { useContext } from "react";
import { DashboardsThemeOptions, TherapeuticEfficacy } from "../types";
import { DashboardContext } from "./DashboardProvider";

export const useDashboards = () => {
    const {
        theme,
        selectedCountries,
        countryContext,
        therapeuticEfficacy,
        molecularMarker,
        studies,
        filteredStudies,
        updatedDates,
        setTheme,
        setSelectedCountries,
        setCountryContext,
        setTherapeuticEfficacy,
        setMolecularMarker,
        setFilteredStudies,
    } = useContext(DashboardContext);

    const onThemeChange = (theme: DashboardsThemeOptions) => {
        setTheme(theme);
    };

    const onSelectedCountriesChange = (selectedCountries: string[]) => {
        if (selectedCountries.length <= 5) {
            setSelectedCountries(selectedCountries);
            setFilteredStudies(
                studies.filter(study => selectedCountries.includes(study.ISO2) || selectedCountries.length === 0)
            );
        }
    };

    const onCountryContextChange = (countryContext: string) => {
        setCountryContext(countryContext);
    };

    const onTherapeuticEfficacyChange = (therapeuticEfficacy: TherapeuticEfficacy) => {
        setTherapeuticEfficacy(therapeuticEfficacy);
    };

    const onMolecularMarkerChange = (molecularMarker: string) => {
        setMolecularMarker(molecularMarker);
    };

    return {
        theme,
        selectedCountries,
        countryContext,
        therapeuticEfficacy,
        molecularMarker,
        studies,
        filteredStudies,
        updatedDates,
        onThemeChange,
        onSelectedCountriesChange,
        onCountryContextChange,
        onTherapeuticEfficacyChange,
        onMolecularMarkerChange,
    };
};
