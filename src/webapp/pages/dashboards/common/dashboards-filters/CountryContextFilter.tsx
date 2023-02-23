import React from "react";
import { TFunction, useTranslation } from "react-i18next";
import { CountryContext, DashboardsThemeOptions } from "../../types";
import { Option } from "../types";
import DashboardContentFilter from "./DashboardContentFilter";

const countryContextOptions = (
    t: TFunction<"translation", undefined>
): Record<DashboardsThemeOptions, Option<CountryContext>[]> => {
    return {
        prevention: [
            {
                label: t("common.dashboard.dashboardsFilterSection.countryContextOptions.countryContext"),
                value: "country-context",
            },
            {
                label: t("common.dashboard.dashboardsFilterSection.countryContextOptions.epidemiologicalProfile"),
                value: "epidemiological-profile",
            },
            {
                label: t("common.dashboard.dashboardsFilterSection.countryContextOptions.vectors"),
                value: "vectors",
            },
            {
                label: t("common.dashboard.dashboardsFilterSection.countryContextOptions.summaryInsecticideResistance"),
                value: "summary-insecticide-resistance",
            },
        ],
        treatment: [
            {
                label: t("common.dashboard.dashboardsFilterSection.countryContextOptions.countryContext"),
                value: "country-context",
            },
            {
                label: t("common.dashboard.dashboardsFilterSection.countryContextOptions.epidemiologicalProfile"),
                value: "epidemiological-profile",
            },
            {
                label: t("common.dashboard.dashboardsFilterSection.countryContextOptions.majorPlasmodium"),
                value: "major-plasmodium",
            },
        ],
    };
};

interface CountryContextFilterProps {
    theme: DashboardsThemeOptions;
    value: CountryContext;
    onChange: (value: CountryContext) => void;
}

const CountryContextFilter: React.FC<CountryContextFilterProps> = ({ theme, value, onChange }) => {
    const { t } = useTranslation();
    return <DashboardContentFilter options={countryContextOptions(t)[theme]} value={value} onChange={onChange} />;
};

export default CountryContextFilter;
