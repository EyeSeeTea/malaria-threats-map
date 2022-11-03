import React from "react";
import i18next from "i18next";
import { CountryContext, DashboardsThemeOptions } from "../../types";
import { Option } from "../types";
import DashboardContentFilter from "./DashboardContentFilter";

const countryContextOptions: Record<DashboardsThemeOptions, Option<CountryContext>[]> = {
    prevention: [
        {
            label: i18next.t("common.dashboard.dashboardsFilterSection.countryContextOptions.countryContext"),
            value: "country-context",
        },
        {
            label: i18next.t("common.dashboard.dashboardsFilterSection.countryContextOptions.epidemiologicalProfile"),
            value: "epidemiological-profile",
        },
        {
            label: i18next.t("common.dashboard.dashboardsFilterSection.countryContextOptions.majorAnophelesSpecies"),
            value: "major-anopheles-species",
        },
        {
            label: i18next.t(
                "common.dashboard.dashboardsFilterSection.countryContextOptions.summaryInsecticideResistance"
            ),
            value: "summary-insecticide-resistance",
        },
    ],
    treatment: [
        {
            label: i18next.t("common.dashboard.dashboardsFilterSection.countryContextOptions.countryContext"),
            value: "country-context",
        },
        {
            label: i18next.t("common.dashboard.dashboardsFilterSection.countryContextOptions.epidemiologicalProfile"),
            value: "epidemiological-profile",
        },
        {
            label: i18next.t("common.dashboard.dashboardsFilterSection.countryContextOptions.majorPlasmodium"),
            value: "major-plasmodium",
        },
    ],
};

interface CountryContextFilterProps {
    theme: DashboardsThemeOptions;
    value: CountryContext;
    onChange: (value: CountryContext) => void;
}

const CountryContextFilter: React.FC<CountryContextFilterProps> = ({ theme, value, onChange }) => {
    return <DashboardContentFilter options={countryContextOptions[theme]} value={value} onChange={onChange} />;
};

export default CountryContextFilter;
