import React, { useCallback, useState } from "react";
import { Card, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { initialTreatmentFilters, TreatmentFiltersState } from "./TreatmentFiltersState";
import PlasmodiumSpecieSelector from "../../../../components/filters/PlasmodiumSpecieSelector";
import DrugsSelector from "../../../../components/filters/DrugsSelector";
import { useDashboards } from "../../context/useDashboards";
import DashboardsYearRangeSelector from "./DashboardsYearRangeSelector";
import ExcludeLowerPatientsSelector from "../../../../components/filters/ExcludeLowerPatientsSelector";

interface TreatmentFiltersProps {
    drugsMultiple?: boolean;
    drugsClearable?: boolean;
}

const TreatmentFilters: React.FC<TreatmentFiltersProps> = ({ drugsMultiple = false, drugsClearable = false }) => {
    const { t } = useTranslation();
    const { filteredStudies } = useDashboards();
    const [filters, setFilters] = useState<TreatmentFiltersState>(initialTreatmentFilters);

    const handlePlasmodiumChange = useCallback(
        (value: string) => {
            setFilters({ ...filters, plasmodiumSpecies: value });
        },
        [filters]
    );

    const handleDrugChange = useCallback(
        (values: string[]) => {
            setFilters({ ...filters, drugs: values });
        },
        [filters]
    );

    const handleYearsChange = useCallback(
        (years: [number, number]) => {
            setFilters({ ...filters, years });
        },
        [filters]
    );

    const handleExclude = useCallback(
        (excludeLowerPatients: boolean) => {
            setFilters({ ...filters, excludeLowerPatients });
        },
        [filters]
    );

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
                onChange={handlePlasmodiumChange}
                value={filters.plasmodiumSpecies}
            />

            <DrugsSelector
                onlyYMargin
                labelBold
                multi={drugsMultiple}
                isClearable={drugsClearable}
                background={"#F7F7F7"}
                studies={filteredStudies}
                onChange={handleDrugChange}
                value={filters.drugs}
            />

            <DashboardsYearRangeSelector years={filters.years} onChange={handleYearsChange} />

            <ExcludeLowerPatientsSelector
                value={filters.excludeLowerPatients}
                onChange={handleExclude}
                fontWeight="bold"
            />
        </FiltersCard>
    );
};

export default TreatmentFilters;

const FiltersCard = styled(Card)`
    min-height: 470px;
    margin-bottom: 15px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
`;
