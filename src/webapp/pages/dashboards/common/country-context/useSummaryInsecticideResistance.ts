import i18next from "i18next";
import _ from "lodash";
import React from "react";
import { cleanMechanismTypeOptions } from "../../../../components/filters/MechanismTypeFilter";
import { filterByResistanceMechanism, filterByResistanceStatus } from "../../../../components/layers/studies-filters";
import { useDashboards } from "../../context/useDashboards";

export function useSummaryInsecticideResistance(): SummaryInsecticideResistanceData[] {
    const { selectedCountries, dashboardsPreventionStudies } = useDashboards();

    const data = React.useMemo(() => {
        const sortCountries = _.orderBy(selectedCountries, country => i18next.t(country), "asc");

        return sortCountries.map(countryISO => {
            const studiesByCountry = dashboardsPreventionStudies.filter(study => study.ISO2 === countryISO);

            const resistanceConfirmedStudies = studiesByCountry
                .filter(filterByResistanceStatus)
                .filter(study => study.RESISTANCE_STATUS === "CONFIRMED_RESISTANCE");

            const country = countryISO;
            const vectorSpecies = _.uniq(resistanceConfirmedStudies.map(study => i18next.t(study.SPECIES)))
                .sort()
                .join(", ");
            const insectidiceClasses = _.uniq(
                resistanceConfirmedStudies.map(study => i18next.t(study.INSECTICIDE_CLASS))
            )
                .sort()
                .join(", ");

            const mechanismDetectedStudies = studiesByCountry
                .filter(filterByResistanceMechanism)
                .filter(study => study.MECHANISM_STATUS === "DETECTED");

            const resistanceMechanisms = cleanMechanismTypeOptions(
                _.uniq(mechanismDetectedStudies.map(study => study.TYPE))
            )
                .map(type => i18next.t(`TYPE.${type}`))
                .join(", ");

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
