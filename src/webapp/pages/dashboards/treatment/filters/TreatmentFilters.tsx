import React from "react";
import { Card, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import PlasmodiumSpecieSelector from "../../../../components/filters/PlasmodiumSpecieSelector";
import DrugsSelector from "../../../../components/filters/DrugsSelector";
import { useDashboards } from "../../context/useDashboards";
import DashboardsYearRangeSelector from "./DashboardsYearRangeSelector";
import ExcludeLowerPatientsSelector from "../../../../components/filters/ExcludeLowerPatientsSelector";

interface TreatmentFiltersProps {
    drugsMultiple?: boolean;
    drugsClearable?: boolean;
    plasmodiumSpecies: string;
    drugs: string[];
    molecularMarker: number;
    years: [number, number];
    excludeLowerPatients: boolean;
    onPlasmodiumSpeciesChange: (value: string) => void;
    onDrugsChange: (values: string[]) => void;
    onMolecularMarkerChange: (value: number) => void;
    onYearsChange: (years: [number, number]) => void;
    onExcludeLowerPatientsChange: (value: boolean) => void;
}

const TreatmentFilters: React.FC<TreatmentFiltersProps> = ({
    drugsMultiple = false,
    drugsClearable = false,
    plasmodiumSpecies,
    drugs,
    years,
    excludeLowerPatients,
    onPlasmodiumSpeciesChange,
    onDrugsChange,
    onYearsChange,
    onExcludeLowerPatientsChange,
}) => {
    const { t } = useTranslation();
    const { dashboardsTreatmentStudies } = useDashboards();

    return (
        <FiltersCard elevation={0}>
            <Typography variant="body2" textTransform="uppercase" fontWeight="bold">
                {t("common.dashboard.treatmentFilters.title")}
            </Typography>
            <PlasmodiumSpecieSelector
                onlyYMargin
                labelBold
                multi={false}
                background={"#F7F7F7"}
                onChange={onPlasmodiumSpeciesChange}
                value={plasmodiumSpecies}
            />

            <DrugsSelector
                onlyYMargin
                labelBold
                multi={drugsMultiple}
                isClearable={drugsClearable}
                background={"#F7F7F7"}
                studies={dashboardsTreatmentStudies}
                onChange={onDrugsChange}
                value={drugs}
            />

            <DashboardsYearRangeSelector years={years} onChange={onYearsChange} />

            <ExcludeLowerPatientsSelector
                value={excludeLowerPatients}
                onChange={onExcludeLowerPatientsChange}
                fontWeight="bold"
            />
        </FiltersCard>
    );
};

export default React.memo(TreatmentFilters);

const FiltersCard = styled(Card)`
    min-height: 470px;
    margin-bottom: 15px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
`;
