import i18next from "i18next";
import _ from "lodash";
import React from "react";
import { filterByResistanceMechanism, filterByResistanceStatus } from "../../../../components/layers/studies-filters";
import { useDashboards } from "../../context/useDashboards";

export function useSummaryInsecticideResistance(): SummaryInsecticideResistanceData[] {
    const { selectedCountries, dashboardsPreventionStudies } = useDashboards();

    const data = React.useMemo(() => {
        return selectedCountries.map(countryISO => {
            const studiesByCountry = dashboardsPreventionStudies.filter(study => study.ISO2 === countryISO);

            const resistanceConfirmedStudies = studiesByCountry
                .filter(filterByResistanceStatus)
                .filter(study => study.RESISTANCE_STATUS === "CONFIRMED_RESISTANCE");

            const country = countryISO;
            const vectorSpecies = _.uniq(resistanceConfirmedStudies.map(study => i18next.t(study.SPECIES))).join(", ");
            const insectidiceClasses = _.uniq(
                resistanceConfirmedStudies.map(study => i18next.t(study.INSECTICIDE_CLASS))
            ).join(", ");

            const mechanismDetectedStudies = studiesByCountry
                .filter(filterByResistanceMechanism)
                .filter(study => study.MECHANISM_STATUS === "DETECTED");

            const resistanceMechanisms = _.uniq(mechanismDetectedStudies.map(study => i18next.t(study.TYPE))).join(
                ", "
            );

            return {
                country,
                vectorSpecies,
                insectidiceClasses,
                resistanceMechanisms,
            };
        });
    }, [selectedCountries, dashboardsPreventionStudies]);

    return data;
}

interface SummaryInsecticideResistanceData {
    country: string;
    vectorSpecies: string;
    insectidiceClasses: string;
    resistanceMechanisms: string;
}
