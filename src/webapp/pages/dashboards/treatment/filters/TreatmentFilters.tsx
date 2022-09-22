import React from "react";
import { Card, IconButton, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import PlasmodiumSpecieSelector from "../../../../components/filters/PlasmodiumSpecieSelector";
import DrugsSelector from "../../../../components/filters/DrugsSelector";
import DashboardsYearRangeSelector from "./DashboardsYearRangeSelector";
import ExcludeLowerPatientsSelector from "../../../../components/filters/ExcludeLowerPatientsSelector";
import { TreatmentStudy } from "../../../../../domain/entities/TreatmentStudy";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import MolecularMarkerSelector from "../../../../components/filters/MolecularMarkerSelector";

interface TreatmentFiltersProps {
    isMolecularMarkerChart: boolean;
    studies: TreatmentStudy[];
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
    onCollapse: () => void;
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
    onPlasmodiumSpeciesChange,
    onDrugsChange,
    onMolecularMarkerChange,
    onYearsChange,
    onExcludeLowerPatientsChange,
    onCollapse,
}) => {
    const { t } = useTranslation();

    return (
        <FiltersCard elevation={0}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" textTransform="uppercase" fontWeight="bold">
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
                        onChange={onPlasmodiumSpeciesChange}
                        value={plasmodiumSpecies}
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
                    />
                </React.Fragment>
            )}

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
