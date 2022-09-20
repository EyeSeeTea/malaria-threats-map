import React from "react";
import i18next from "i18next";
import DashboardContentFilter from "../../common/dashboards-filters/DashboardContentFilter";
import { Option } from "../../common/types";
import { PhenotypicInsecticideResistance } from "../types";

const options: Option<PhenotypicInsecticideResistance>[] = [
    {
        label: i18next.t(
            "common.dashboard.dashboardsFilterSection.phenotypicInsecticideResistanceOptions.phenotypicInsecticideResistance"
        ),
        value: "all",
    },
    {
        label: i18next.t(
            "common.dashboard.dashboardsFilterSection.phenotypicInsecticideResistanceOptions.statusOfResistanceToInsecticides"
        ),
        value: "status-resistance-insecticide",
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
    return <DashboardContentFilter options={options} value={value} onChange={onChange} />;
};

export default PhenotypicInsecticideResistanceFilter;
