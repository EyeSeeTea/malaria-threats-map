import React from "react";
import { TFunction, useTranslation } from "react-i18next";
import DashboardContentFilter from "../../common/dashboards-filters/DashboardContentFilter";
import { Option } from "../../common/types";
import { MolecularMechanismDetection } from "../types";

const options = (t: TFunction<"translation", undefined>): Option<MolecularMechanismDetection>[] => [
    {
        label: t(
            "common.dashboard.dashboardsFilterSection.molecularMechanismDetectionOptions.molecularMechanismDetection"
        ),
        value: "molecular-mechanism-detection",
    },
    {
        label: t(
            "common.dashboard.dashboardsFilterSection.molecularMechanismDetectionOptions.insecticideResistanceAndResistanceMechanism"
        ),
        value: "insecticide-resistance-resistance-mechanisms",
    },
];

interface MolecularMechanishDetectionFilterProps {
    value: MolecularMechanismDetection;
    onChange: (value: MolecularMechanismDetection) => void;
}

const MolecularMechanishDetectionFilter: React.FC<MolecularMechanishDetectionFilterProps> = ({ value, onChange }) => {
    const { t } = useTranslation();
    return <DashboardContentFilter options={options(t)} value={value} onChange={onChange} />;
};

export default MolecularMechanishDetectionFilter;
