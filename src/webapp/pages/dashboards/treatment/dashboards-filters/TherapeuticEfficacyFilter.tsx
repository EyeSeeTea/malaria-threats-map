import React from "react";
import { TFunction, useTranslation } from "react-i18next";
import DashboardContentFilter from "../../common/dashboards-filters/DashboardContentFilter";
import { Option } from "../../common/types";
import { TherapeuticEfficacy } from "../types";

const therapeuticEfficacyOptions = (t: TFunction<"translation", undefined>): Option<TherapeuticEfficacy>[] => [
    {
        label: t("common.dashboard.dashboardsFilterSection.therapeuticEfficacyOptions.therapeuticEfficacy"),
        value: "therapeutic-efficacy",
    },
    {
        label: t("common.dashboard.dashboardsFilterSection.therapeuticEfficacyOptions.summaryTreatmentFailures"),
        value: "summary-treatment-failures",
    },
    {
        label: t("common.dashboard.dashboardsFilterSection.therapeuticEfficacyOptions.treatmentFailureRates"),
        value: "treatment-failure-rates",
    },
    {
        label: t("common.dashboard.dashboardsFilterSection.therapeuticEfficacyOptions.parasiteClearance"),
        value: "parasite-clearance-rates",
    },
];

interface TherapeuticEfficacyFilterProps {
    value: TherapeuticEfficacy;
    onChange: (value: TherapeuticEfficacy) => void;
}

const TherapeuticEfficacyFilter: React.FC<TherapeuticEfficacyFilterProps> = ({ value, onChange }) => {
    const { t } = useTranslation();
    return <DashboardContentFilter options={therapeuticEfficacyOptions(t)} value={value} onChange={onChange} />;
};

export default TherapeuticEfficacyFilter;
