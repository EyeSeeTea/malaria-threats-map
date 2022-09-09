import React from "react";
import i18next from "i18next";
import DashboardContentFilter from "../../common/dashboards-filters/DashboardContentFilter";
import { Option } from "../../common/types";
import { MolecularMarker } from "../types";

const molecularMarkerOptions: Option<MolecularMarker>[] = [
    {
        label: i18next.t("common.dashboard.dashboardsFilterSection.molecularMarkerOptions.molecularMarker"),
        value: "all",
    },
    {
        label: i18next.t("common.dashboard.dashboardsFilterSection.molecularMarkerOptions.summaryMolecularMarker"),
        value: "summary-molecular-marker",
    },
];

interface MolecularMarkerFilterProps {
    value: MolecularMarker;
    onChange: (value: MolecularMarker) => void;
}

const MolecularMarkerFilter: React.FC<MolecularMarkerFilterProps> = ({ value, onChange }) => {
    return <DashboardContentFilter options={molecularMarkerOptions} value={value} onChange={onChange} />;
};

export default MolecularMarkerFilter;
