import { Button, Card, Fab, Grid, Stack } from "@mui/material";
import Highcharts from "highcharts";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import TreatmentFilters from "./filters/TreatmentFilters";
import More from "highcharts/highcharts-more";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import DownloadIcon from "@mui/icons-material/Download";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { TreatmentStudy } from "../../../../domain/entities/TreatmentStudy";
import InformationModal from "../../../components/dashboards/InformationModal";
import HighchartsReact from "highcharts-react-official";
import { toPng } from "html-to-image";
import { MolecularMarker } from "../../../components/filters/MolecularMarkerFilter";

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
    onPlasmodiumChange: (value: string) => void;
    onDrugsChange: (value: string[]) => void;
    onYearsChange: (value: [number, number]) => void;
    onExcludeLowerPatientsChange?: (value: boolean) => void;
    onExcludeLowerSamplesChange?: (value: boolean) => void;
    onMolecularMarkerChange: (value: MolecularMarker) => void;
}

More(Highcharts);
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
    onPlasmodiumChange,
    onDrugsChange,
    onYearsChange,
    onExcludeLowerPatientsChange,
    onExcludeLowerSamplesChange,
    onMolecularMarkerChange,
    children,
}) => {
    const [filtersVisible, setFiltersVisible] = React.useState(true);
    const [openInfoModal, setOpenInfoModal] = React.useState(false);
    const handleOpenInfoModal = () => setOpenInfoModal(true);
    const handleCloseInfoModal = () => setOpenInfoModal(false);

    const { t } = useTranslation();

    const ref = useRef<HTMLDivElement>(null);

    const handleFiltersVisible = React.useCallback(() => {
        setFiltersVisible(!filtersVisible);
    }, [filtersVisible]);

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
        if (ref.current === null) {
            return;
        }

        toPng(ref.current, { backgroundColor: "#F7F7F7" })
            .then(dataUrl => {
                const link = document.createElement("a");
                link.download = title;
                link.href = dataUrl;
                link.click();
            })
            .catch(err => {
                console.log(err);
            });
    }, [ref, title]);

    return (
        <React.Fragment>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Title id={id}>{title}</Title>
                <Stack direction="row" spacing={2}>
                    <Fab color="primary" size="small">
                        <InfoOutlinedIcon sx={{ color: "white", width: "20px" }} onClick={handleOpenInfoModal} />
                    </Fab>
                    <Fab color="primary" size="small" onClick={handleDownload}>
                        <DownloadIcon sx={{ color: "white" }} />
                    </Fab>
                </Stack>
            </Stack>
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
                                onPlasmodiumSpeciesChange={onPlasmodiumChange}
                                onDrugsChange={onDrugsChange}
                                onMolecularMarkerChange={onMolecularMarkerChange}
                                onYearsChange={onYearsChange}
                                onExcludeLowerPatientsChange={onExcludeLowerPatientsChange}
                                onExcludeLowerSamplesChange={onExcludeLowerSamplesChange}
                                onCollapse={handleFiltersVisible}
                            ></TreatmentFilters>
                            <StudiesCountCard elevation={0}>
                                {t("common.dashboard.therapeuticEfficacySection.numStudies", {
                                    count: studiesCount,
                                })}
                            </StudiesCountCard>
                        </Stack>
                    </Grid>
                )}
                <Grid item md={filtersVisible ? 9 : 12} xs={12}>
                    <DasboardCard elevation={0}>
                        {!filtersVisible && (
                            <Button startIcon={<FilterAltIcon />} onClick={handleFiltersVisible}>
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
        </React.Fragment>
    );
};

export default TreatmentFilterableDashboard;

const DasboardCard = styled(Card)`
    min-height: 500px;
    padding: 42px;
`;

const StudiesCountCard = styled(Card)`
    padding: 24px;
`;

const Title = styled.h3`
    font-size: 23px;
    margin-bottom: 30px;
    color: #2ba681;
    text-transform: uppercase;
`;
