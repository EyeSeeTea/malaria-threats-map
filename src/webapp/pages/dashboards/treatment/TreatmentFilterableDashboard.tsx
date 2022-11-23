import { Button, Card, Grid, Stack } from "@mui/material";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import TreatmentFilters from "./filters/TreatmentFilters";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { TreatmentStudy } from "../../../../domain/entities/TreatmentStudy";
import InformationModal from "../../../components/dashboards/TreatmentInformationModal";
import HighchartsReact from "highcharts-react-official";
import { MolecularMarker } from "../../../components/filters/MolecularMarkerFilter";
import { useFiltersVisible } from "../common/filters/useFiltersVisible";
import DashboardTitle from "../common/DashboardTitle";
import { downloadHtmlElement } from "../utils";

interface TreatmentFilterableDashboardProps {
    id?: string;
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
    excludeLowerPatients?: boolean;
    excludeLowerSamples?: boolean;
    PlasmodiumSpecieDisabled?: boolean;
    onPlasmodiumChange: (value: string) => void;
    onDrugsChange: (value: string[]) => void;
    onYearsChange: (value: [number, number]) => void;
    onExcludeLowerPatientsChange?: (value: boolean) => void;
    onExcludeLowerSamplesChange?: (value: boolean) => void;
    onMolecularMarkerChange: (value: MolecularMarker) => void;
}

const TreatmentFilterableDashboard: React.FC<TreatmentFilterableDashboardProps> = ({
    id,
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
}) => {
    const { filtersVisible, onChangeFiltersVisible } = useFiltersVisible();
    const [openInfoModal, setOpenInfoModal] = React.useState(false);
    const handleOpenInfoModal = () => setOpenInfoModal(true);
    const handleCloseInfoModal = () => setOpenInfoModal(false);

    const { t } = useTranslation();

    const ref = useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (Array.isArray(chartComponentRef?.current)) {
            chartComponentRef?.current?.forEach(current => {
                current?.chart?.reflow();
            });
        } else {
            chartComponentRef?.current?.chart.reflow();
        }
    }, [filtersVisible, chartComponentRef]);

    const handleDownload = React.useCallback(() => {
        downloadHtmlElement(ref.current, title);
    }, [ref, title]);

    return (
        <Container ref={ref}>
            <DashboardTitle
                id={id}
                title={title}
                onInfoClick={handleOpenInfoModal}
                onDownloadClick={handleDownload}
                showActions={true}
            />

            <Grid container spacing={2} ref={ref} sx={{ marginBottom: 3 }}>
                {filtersVisible && (
                    <Grid item md={3} xs={12}>
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
                                excludeLowerPatients={excludeLowerPatients}
                                excludeLowerSamples={excludeLowerSamples}
                                PlasmodiumSpecieDisabled={PlasmodiumSpecieDisabled}
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
                    </Grid>
                )}
                <Grid item md={filtersVisible ? 9 : 12} xs={12}>
                    <DasboardCard elevation={0}>
                        {!filtersVisible && (
                            <Button startIcon={<FilterAltIcon />} onClick={onChangeFiltersVisible}>
                                {"Filter data"}
                            </Button>
                        )}
                        <div ref={ref}>{children}</div>
                    </DasboardCard>
                </Grid>
                <InformationModal
                    title={title}
                    type={type}
                    years={years}
                    openInfoModal={openInfoModal}
                    handleCloseInfoModal={handleCloseInfoModal}
                />
            </Grid>
        </Container>
    );
};

export default TreatmentFilterableDashboard;

const Container = styled.div`
    padding: 10px;
`;

const DasboardCard = styled(Card)`
    min-height: 500px;
    padding: 42px;
`;

const StudiesCountCard = styled(Card)`
    padding: 24px;
`;
