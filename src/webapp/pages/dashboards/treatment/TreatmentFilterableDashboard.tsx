import { Button, Card, Grid, Stack, ToggleButtonGroup } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import TreatmentFilters from "./filters/TreatmentFilters";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { TreatmentStudy } from "../../../../domain/entities/TreatmentStudy";
import InformationModal from "../../../components/dashboards/TreatmentInformationModal";
import HighchartsReact from "highcharts-react-official";
import { MolecularMarker } from "../../../components/filters/MolecularMarkerRadioFilter";
import { useFiltersVisible } from "../common/filters/useFiltersVisible";
import DashboardTitle from "../common/DashboardTitle";
import ScreenshotModal from "../../../components/ScreenshotModal";
import { Option } from "../common/types";
import { ChartTypeOption } from "../common/chart-type-option/ChartTypeOption";

const SCREENSHOT_BACKGROUND_COLOR = "#F7F7F7";
const SCREENSHOT_EXCLUSION_CLASSES = ["dashboard-action"];

interface TreatmentFilterableDashboardProps {
    id?: string;
    chartTypes?: Option<string>[];
    chartType?: string;
    isMolecularMarkerChart?: boolean;
    drugsMultiple: boolean;
    drugsClearable: boolean;
    chartComponentRef?: React.MutableRefObject<HighchartsReact.RefObject[] | HighchartsReact.RefObject>;
    title: string;
    type: "treatmentFailureByDrug" | "treatmentFailure" | "positiveDay3" | "molecularMarkerStudy";
    filteredStudiesForDrugs: TreatmentStudy[];
    studiesCount: number;
    plasmodiumSpecies: string;
    drugs: string[];
    molecularMarker: MolecularMarker;
    years: [number, number];
    maxMinYears: [number, number];
    excludeLowerPatients?: boolean;
    excludeLowerSamples?: boolean;
    PlasmodiumSpecieDisabled?: boolean;
    onPlasmodiumChange: (value: string) => void;
    onDrugsChange: (value: string[]) => void;
    onYearsChange: (value: [number, number]) => void;
    onExcludeLowerPatientsChange?: (value: boolean) => void;
    onExcludeLowerSamplesChange?: (value: boolean) => void;
    onMolecularMarkerChange: (value: MolecularMarker) => void;
    onChartTypeChange?: (value: string) => void;
}

interface TreatmentFilterableDashboardComponentProps extends TreatmentFilterableDashboardProps {
    onScreenshot?: () => void;
    isScreenshot?: boolean;
}

const TreatmentFilterableDashboardComponent: React.FC<TreatmentFilterableDashboardComponentProps> = ({
    id,
    chartTypes,
    chartType,
    isMolecularMarkerChart = false,
    drugsMultiple,
    drugsClearable,
    chartComponentRef,
    title,
    type,
    filteredStudiesForDrugs,
    studiesCount,
    plasmodiumSpecies,
    drugs,
    molecularMarker,
    years,
    maxMinYears,
    excludeLowerPatients,
    excludeLowerSamples,
    PlasmodiumSpecieDisabled,
    onPlasmodiumChange,
    onDrugsChange,
    onYearsChange,
    onExcludeLowerPatientsChange,
    onExcludeLowerSamplesChange,
    onMolecularMarkerChange,
    children,
    onScreenshot,
    isScreenshot = false,
    onChartTypeChange,
}) => {
    const { filtersVisible, onChangeFiltersVisible } = useFiltersVisible();
    const [openInfoModal, setOpenInfoModal] = React.useState(false);
    const handleOpenInfoModal = () => setOpenInfoModal(true);
    const handleCloseInfoModal = () => setOpenInfoModal(false);

    const { t } = useTranslation();

    React.useEffect(() => {
        if (Array.isArray(chartComponentRef?.current)) {
            chartComponentRef?.current?.forEach(current => {
                current?.chart?.reflow();
            });
        } else {
            chartComponentRef?.current?.chart.reflow();
        }
    }, [filtersVisible, chartComponentRef]);

    const handleChartTypeChange = React.useCallback(
        (_event: React.MouseEvent<HTMLElement>, value: string) => {
            if (onChartTypeChange) {
                onChartTypeChange(value);
            }
        },
        [onChartTypeChange]
    );

    return (
        <Container $isScreenshot={isScreenshot}>
            <DashboardTitle
                id={id}
                title={title}
                onInfoClick={handleOpenInfoModal}
                onDownloadClick={onScreenshot}
                showActions={!isScreenshot}
            />

            {chartTypes && !isScreenshot && (
                <ToggleButtonGroup
                    value={chartType}
                    exclusive
                    onChange={handleChartTypeChange}
                    aria-label="text alignment"
                    sx={{ marginBottom: 2 }}
                >
                    {chartTypes.map(type => {
                        return (
                            <ChartTypeOption key={type.value} value={type.value}>
                                {type.label}
                            </ChartTypeOption>
                        );
                    })}
                </ToggleButtonGroup>
            )}

            <StyledGridContainer container spacing={2} sx={{ marginBottom: 3 }} $isScreenshot={isScreenshot}>
                {filtersVisible && (
                    <StyledGridItem item md={3} xs={12} $isScreenshot={isScreenshot}>
                        <Stack direction="column">
                            <TreatmentFilters
                                isMolecularMarkerChart={isMolecularMarkerChart}
                                studies={filteredStudiesForDrugs}
                                drugsMultiple={drugsMultiple}
                                drugsClearable={drugsClearable}
                                plasmodiumSpecies={plasmodiumSpecies}
                                drugs={drugs}
                                molecularMarker={molecularMarker}
                                years={years}
                                maxMinYears={maxMinYears}
                                excludeLowerPatients={excludeLowerPatients}
                                excludeLowerSamples={excludeLowerSamples}
                                PlasmodiumSpecieDisabled={PlasmodiumSpecieDisabled || isScreenshot}
                                onPlasmodiumSpeciesChange={onPlasmodiumChange}
                                onDrugsChange={onDrugsChange}
                                onMolecularMarkerChange={onMolecularMarkerChange}
                                onYearsChange={onYearsChange}
                                onExcludeLowerPatientsChange={onExcludeLowerPatientsChange}
                                onExcludeLowerSamplesChange={onExcludeLowerSamplesChange}
                                onCollapse={onChangeFiltersVisible}
                            ></TreatmentFilters>
                            <StudiesCountCard elevation={0}>
                                {t("common.dashboard.therapeuticEfficacyDashboards.numStudies", {
                                    count: studiesCount,
                                })}
                            </StudiesCountCard>
                        </Stack>
                    </StyledGridItem>
                )}
                <StyledGridItem item md={filtersVisible ? 9 : 12} xs={12} $isScreenshot={isScreenshot}>
                    <DasboardCard elevation={0}>
                        {!filtersVisible && (
                            <Button startIcon={<FilterAltIcon />} onClick={onChangeFiltersVisible}>
                                {"Filter data"}
                            </Button>
                        )}
                        <div>{children}</div>
                    </DasboardCard>
                </StyledGridItem>
                <InformationModal
                    title={title}
                    type={type}
                    years={years}
                    openInfoModal={openInfoModal}
                    handleCloseInfoModal={handleCloseInfoModal}
                />
            </StyledGridContainer>
        </Container>
    );
};

const TreatmentFilterableDashboard: React.FC<TreatmentFilterableDashboardProps> = props => {
    const [open, setOpen] = React.useState(false);

    const handleScreenshot = React.useCallback(() => {
        setOpen(true);
    }, []);

    const handleCloseScreenshot = React.useCallback(() => {
        setOpen(false);
    }, []);

    return (
        <>
            <TreatmentFilterableDashboardComponent {...props} onScreenshot={handleScreenshot} />
            <ScreenshotModal
                open={open}
                onClose={handleCloseScreenshot}
                title={props.title}
                backgroundColor={SCREENSHOT_BACKGROUND_COLOR}
                exclusionClasses={SCREENSHOT_EXCLUSION_CLASSES}
            >
                <TreatmentFilterableDashboardComponent {...props} isScreenshot />
            </ScreenshotModal>
        </>
    );
};

export default TreatmentFilterableDashboard;

const Container = styled.div<{ $isScreenshot: boolean }>`
    padding: 10px;
    width: ${props => props?.$isScreenshot && "fit-content"};
`;

const StyledGridItem = styled(Grid)<{ $isScreenshot: boolean }>`
    width: ${props => props?.$isScreenshot && "fit-content"};
    max-width: ${props => props?.$isScreenshot && "fit-content"};
    .MuiChip-root,
    .MuiChip-label {
        overflow: ${props => props?.$isScreenshot && "initial"};
    }
`;

const StyledGridContainer = styled(Grid)<{ $isScreenshot: boolean }>`
    flex-wrap: ${props => props?.$isScreenshot && "nowrap"};
`;

const DasboardCard = styled(Card)`
    min-height: 500px;
    padding: 42px;
`;

const StudiesCountCard = styled(Card)`
    padding: 24px;
`;
