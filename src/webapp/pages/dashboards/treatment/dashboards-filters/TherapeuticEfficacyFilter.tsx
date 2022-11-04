import React from "react";
import i18next from "i18next";
import DashboardContentFilter from "../../common/dashboards-filters/DashboardContentFilter";
import { Option } from "../../common/types";
import { TherapeuticEfficacy } from "../types";

const therapeuticEfficacyOptions: Option<TherapeuticEfficacy>[] = [
    {
        label: i18next.t("common.dashboard.dashboardsFilterSection.therapeuticEfficacyOptions.therapeuticEfficacy"),
        value: "therapeutic-efficacy",
    },
    {
        label: i18next.t(
            "common.dashboard.dashboardsFilterSection.therapeuticEfficacyOptions.summaryTreatmentFailures"
        ),
        value: "summary-treatment-failures",
    },
    {
        label: i18next.t("common.dashboard.dashboardsFilterSection.therapeuticEfficacyOptions.treatmentFailureRates"),
        value: "treatment-failure-rates",
    },
    {
        label: i18next.t("common.dashboard.dashboardsFilterSection.therapeuticEfficacyOptions.parasiteClearanceRates"),
        value: "parasite-clearance-rates",
    },
];

interface TherapeuticEfficacyFilterProps {
    value: TherapeuticEfficacy;
    onChange: (value: TherapeuticEfficacy) => void;
}

const TherapeuticEfficacyFilter: React.FC<TherapeuticEfficacyFilterProps> = ({ value, onChange }) => {
    return <DashboardContentFilter options={therapeuticEfficacyOptions} value={value} onChange={onChange} />;
};

export default TherapeuticEfficacyFilter;
