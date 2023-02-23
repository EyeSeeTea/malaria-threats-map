import React from "react";
import { TFunction, useTranslation } from "react-i18next";
import DashboardContentFilter from "../../common/dashboards-filters/DashboardContentFilter";
import { Option } from "../../common/types";
import { MolecularMarker } from "../types";

const molecularMarkerOptions = (t: TFunction<"translation", undefined>): Option<MolecularMarker>[] => [
    {
        label: t("common.dashboard.dashboardsFilterSection.molecularMarkerOptions.molecularMarker"),
        value: "molecular-marker",
    },
    {
        label: t("common.dashboard.dashboardsFilterSection.molecularMarkerOptions.summaryMolecularMarker"),
        value: "summary-molecular-marker",
    },
];

interface MolecularMarkerFilterProps {
    value: MolecularMarker;
    onChange: (value: MolecularMarker) => void;
}

const MolecularMarkerFilter: React.FC<MolecularMarkerFilterProps> = ({ value, onChange }) => {
    const { t } = useTranslation();
    return <DashboardContentFilter options={molecularMarkerOptions(t)} value={value} onChange={onChange} />;
};

export default MolecularMarkerFilter;
