import React from "react";
import { TFunction, useTranslation } from "react-i18next";
import DashboardContentFilter from "../../common/dashboards-filters/DashboardContentFilter";
import { Option } from "../../common/types";
import { PhenotypicInsecticideResistance } from "../types";

const options = (t: TFunction<"translation", undefined>): Option<PhenotypicInsecticideResistance>[] => [
    {
        label: t(
            "common.dashboard.dashboardsFilterSection.phenotypicInsecticideResistanceOptions.phenotypicInsecticideResistance"
        ),
        value: "phenotypic-insecticide-resistance",
    },
    {
        label: t(
            "common.dashboard.dashboardsFilterSection.phenotypicInsecticideResistanceOptions.statusOfResistanceToInsecticides"
        ),
        value: "status-resistance-insecticide",
    },
    {
        label: t("common.dashboard.dashboardsFilterSection.phenotypicInsecticideResistanceOptions.mosquitoOverTime"),
        value: "mosquito-mortality-over-time",
    },
];

interface PhenotypicInsecticideResistanceFilterProps {
    value: PhenotypicInsecticideResistance;
    onChange: (value: PhenotypicInsecticideResistance) => void;
}

const PhenotypicInsecticideResistanceFilter: React.FC<PhenotypicInsecticideResistanceFilterProps> = ({
    value,
    onChange,
}) => {
    const { t } = useTranslation();
    return <DashboardContentFilter options={options(t)} value={value} onChange={onChange} />;
};

export default PhenotypicInsecticideResistanceFilter;
