import React from "react";
import i18next from "i18next";
import { CountryContext } from "../../types";
import { Option } from "../types";
import DashboardContentFilter from "./DashboardContentFilter";

const countryContextOptions: Option<CountryContext>[] = [
    { label: i18next.t("common.dashboard.dashboardsFilterSection.countryContextOptions.countryContext"), value: "all" },
    {
        label: i18next.t("common.dashboard.dashboardsFilterSection.countryContextOptions.epidemiologicalProfile"),
        value: "epidemiological-profile",
    },
    {
        label: i18next.t("common.dashboard.dashboardsFilterSection.countryContextOptions.majorPlasmodium"),
        value: "major-plasmodium",
    },
];

interface CountryContextFilterProps {
    value: CountryContext;
    onChange: (value: CountryContext) => void;
}

const CountryContextFilter: React.FC<CountryContextFilterProps> = ({ value, onChange }) => {
    return <DashboardContentFilter options={countryContextOptions} value={value} onChange={onChange} />;
};

export default CountryContextFilter;
