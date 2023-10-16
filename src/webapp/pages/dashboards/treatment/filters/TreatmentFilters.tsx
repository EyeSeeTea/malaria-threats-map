import React from "react";
import { Card, IconButton, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import PlasmodiumSpecieSelector from "../../../../components/filters/PlasmodiumSpecieSelector";
import DrugsSelector from "../../../../components/filters/DrugsSelector";
import DashboardsYearRangeSelector from "../../common/filters/DashboardsYearRangeSelector";
import ExcludeLowerPatientsSelector from "../../../../components/filters/ExcludeLowerPatientsSelector";
import { TreatmentStudy } from "../../../../../domain/entities/TreatmentStudy";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import MolecularMarkerSelector from "../../../../components/filters/MolecularMarkerSelector";
import ExcludeLowerSamplesSelector from "../../../../components/filters/ExcludeLowerSamplesSelector";
import { TreatmentFiltersState } from "./TreatmentFiltersState";
import ShowDataForAllCountriesSelector from "../../common/filters/ShowDataForAllCountriesSelector";

interface TreatmentFiltersProps {
    isMolecularMarkerChart: boolean;
    studies: TreatmentStudy[];
    drugsMultiple?: boolean;
    drugsClearable?: boolean;
    filters: TreatmentFiltersState;
    plasmodiumSpecieDisabled: boolean;
    onCollapse: () => void;
}

const TreatmentFilters: React.FC<TreatmentFiltersProps> = ({
    isMolecularMarkerChart,
    studies,
    drugsMultiple = false,
    drugsClearable = false,
    filters,
    plasmodiumSpecieDisabled,
    onCollapse,
}) => {
    const { t } = useTranslation();

    return (
        <FiltersCard elevation={0}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" textTransform="uppercase" fontWeight="bold" sx={{ width: "100%" }}>
                    {t("common.dashboard.treatmentFilters.title")}
                </Typography>

                <IconButton onClick={onCollapse} size="small">
                    <ArrowBackIosIcon />
                </IconButton>
            </Stack>

            {!isMolecularMarkerChart && (
                <React.Fragment>
                    <PlasmodiumSpecieSelector
                        onlyYMargin
                        labelBold
                        multi={false}
                        background={"#F7F7F7"}
                        onChange={filters.onPlasmodiumChange}
                        value={filters.plasmodiumSpecies}
                        isDisabled={plasmodiumSpecieDisabled}
                    />

                    <DrugsSelector
                        onlyYMargin
                        labelBold
                        multi={drugsMultiple}
                        isClearable={drugsClearable}
                        background={"#F7F7F7"}
                        studies={studies}
                        onChange={filters.onDrugsChange}
                        value={filters.drugs}
                    />
                </React.Fragment>
            )}
            {isMolecularMarkerChart && (
                <React.Fragment>
                    <MolecularMarkerSelector
                        onlyYMargin
                        labelBold
                        multi={false}
                        background={"#F7F7F7"}
                        onChange={filters.onMolecularMarkerChange}
                        value={filters.molecularMarker}
                    />
                </React.Fragment>
            )}

            {filters.onChangeShowDataForAllCountries && (
                <ShowDataForAllCountriesSelector
                    value={filters.showDataForAllCountries}
                    onChange={filters.onChangeShowDataForAllCountries}
                />
            )}

            <DashboardsYearRangeSelector
                years={filters.years}
                onChange={filters.onYearsChange}
                maxMinYears={filters.maxMinYears}
            />

            {filters.onExcludeLowerSamplesChange && (
                <ExcludeLowerSamplesSelector
                    value={filters.excludeLowerSamples}
                    onChange={filters.onExcludeLowerSamplesChange}
                    fontWeight="bold"
                />
            )}

            {filters.onExcludeLowerPatientsChange && (
                <ExcludeLowerPatientsSelector
                    value={filters.excludeLowerPatients}
                    onChange={filters.onExcludeLowerPatientsChange}
                    fontWeight="bold"
                />
            )}
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
    overflow: visible;
`;
