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
import { MolecularMarker } from "../../../../components/filters/MolecularMarkerFilter";
import ExcludeLowerSamplesSelector from "../../../../components/filters/ExcludeLowerSamplesSelector";

interface TreatmentFiltersProps {
    isMolecularMarkerChart: boolean;
    studies: TreatmentStudy[];
    drugsMultiple?: boolean;
    drugsClearable?: boolean;
    plasmodiumSpecies: string;
    drugs: string[];
    molecularMarker: number;
    years: [number, number];
    excludeLowerPatients?: boolean;
    excludeLowerSamples?: boolean;
    PlasmodiumSpecieDisabled?: boolean;
    onPlasmodiumSpeciesChange: (value: string) => void;
    onDrugsChange: (values: string[]) => void;
    onMolecularMarkerChange: (value: MolecularMarker) => void;
    onYearsChange: (years: [number, number]) => void;
    onExcludeLowerPatientsChange?: (value: boolean) => void;
    onExcludeLowerSamplesChange?: (value: boolean) => void;
    onCollapse: () => void;
    isCollapseDisabled?: boolean;
    isDrugsSelectorDisabled?: boolean;
    isMolecularMarkerSelectorDisabled?: boolean;
    isYearRangeSelectorDisabled?: boolean;
    isExcludeLowerSamplesSelectorDisabled?: boolean;
    isExcludeLowerPatientsSelectorDisabled?: boolean;
}

const TreatmentFilters: React.FC<TreatmentFiltersProps> = ({
    isMolecularMarkerChart,
    studies,
    drugsMultiple = false,
    drugsClearable = false,
    plasmodiumSpecies,
    drugs,
    molecularMarker,
    years,
    excludeLowerPatients,
    excludeLowerSamples,
    PlasmodiumSpecieDisabled,
    onPlasmodiumSpeciesChange,
    onDrugsChange,
    onMolecularMarkerChange,
    onYearsChange,
    onExcludeLowerPatientsChange,
    onExcludeLowerSamplesChange,
    onCollapse,
    isCollapseDisabled = false,
    isDrugsSelectorDisabled = false,
    isMolecularMarkerSelectorDisabled = false,
    isYearRangeSelectorDisabled = false,
    isExcludeLowerSamplesSelectorDisabled = false,
    isExcludeLowerPatientsSelectorDisabled = false,
}) => {
    const { t } = useTranslation();

    return (
        <FiltersCard elevation={0}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" textTransform="uppercase" fontWeight="bold" sx={{ width: "100%" }}>
                    {t("common.dashboard.treatmentFilters.title")}
                </Typography>

                <IconButton onClick={onCollapse} size="small" disabled={isCollapseDisabled}>
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
                        onChange={onPlasmodiumSpeciesChange}
                        value={plasmodiumSpecies}
                        isDisabled={PlasmodiumSpecieDisabled}
                    />

                    <DrugsSelector
                        onlyYMargin
                        labelBold
                        multi={drugsMultiple}
                        isClearable={drugsClearable}
                        background={"#F7F7F7"}
                        studies={studies}
                        onChange={onDrugsChange}
                        value={drugs}
                        isDisabled={isDrugsSelectorDisabled}
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
                        onChange={onMolecularMarkerChange}
                        value={molecularMarker}
                        isDisabled={isMolecularMarkerSelectorDisabled}
                    />
                </React.Fragment>
            )}

            <StyledDashboardsYearRangeSelector
                years={years}
                onChange={onYearsChange}
                isDisabled={isYearRangeSelectorDisabled}
            />

            {onExcludeLowerSamplesChange && (
                <ExcludeLowerSamplesSelector
                    value={excludeLowerSamples}
                    onChange={onExcludeLowerSamplesChange}
                    fontWeight="bold"
                    isDisabled={isExcludeLowerSamplesSelectorDisabled}
                />
            )}

            {onExcludeLowerPatientsChange && (
                <ExcludeLowerPatientsSelector
                    value={excludeLowerPatients}
                    onChange={onExcludeLowerPatientsChange}
                    fontWeight="bold"
                    isDisabled={isExcludeLowerPatientsSelectorDisabled}
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

const StyledDashboardsYearRangeSelector = styled(DashboardsYearRangeSelector)`
`;
