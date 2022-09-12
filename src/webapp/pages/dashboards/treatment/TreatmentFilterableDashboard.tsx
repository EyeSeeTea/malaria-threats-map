import { Box, Button, Card, Fab, Grid, IconButton, Stack, Typography } from "@mui/material";
import Highcharts from "highcharts";
import React, { useRef } from "react";
import { useTranslation, Trans } from "react-i18next";
import styled from "styled-components";
import TreatmentFilters from "./filters/TreatmentFilters";
import More from "highcharts/highcharts-more";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { TreatmentStudy } from "../../../../domain/entities/TreatmentStudy";
import HighchartsReact from "highcharts-react-official";
import html2canvas from "html2canvas";

interface TreatmentFilterableDashboardProps {
    drugsMultiple: boolean;
    drugsClearable: boolean;
    chartComponentRef?: React.MutableRefObject<HighchartsReact.RefObject>;
    title: string;
    filteredStudiesForDrugs: TreatmentStudy[];
    studiesCount: number;
    plasmodiumSpecies: string;
    drugs: string[];
    molecularMarker: number;
    years: [number, number];
    excludeLowerPatients: boolean;
    onPlasmodiumChange: (value: string) => void;
    onDrugsChange: (value: string[]) => void;
    onYearsChange: (value: [number, number]) => void;
    onExcludeLowerPatientsChange: (value: boolean) => void;
    onMolecularMarkerChange: (value: number) => void;
}

const InfoModal = styled(Paper)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: medium;
    border-width: 0px;
    padding: 60px 100px;
    border-color: black;
    @media (max-width: 1440px) {
        width: 70vw;
    }
    @media (max-width: 1024px) {
        padding: 40px 60px;
        width: 80vw;
    }
    @media (max-width: 768px) {
        padding: 20px 30px;
        width: 80vw;
    }
`;

More(Highcharts);
const TreatmentFilterableDashboard: React.FC<TreatmentFilterableDashboardProps> = ({
    drugsMultiple,
    drugsClearable,
    chartComponentRef,
    title,
    filteredStudiesForDrugs,
    studiesCount,
    plasmodiumSpecies,
    drugs,
    molecularMarker,
    years,
    excludeLowerPatients,
    onPlasmodiumChange,
    onDrugsChange,
    onYearsChange,
    onExcludeLowerPatientsChange,
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
        const chart = chartComponentRef?.current?.chart;

        chart?.reflow();
    }, [filtersVisible, chartComponentRef]);

    const handleDownload = React.useCallback(() => {
        if (ref.current === null) {
            return;
        }

        html2canvas(ref.current).then(canvas => {
            const link = document.createElement("a");
            link.download = title;
            link.href = canvas.toDataURL();
            link.click();
        });
    }, [ref, title]);

    return (
        <React.Fragment>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Title>{title}</Title>
                <Stack direction="row" spacing={2}>
                    <Fab color="primary" size="small">
                        <InfoOutlinedIcon sx={{ color: "white", width: "20px" }} onClick={handleOpenInfoModal} />
                    </Fab>
                    <Fab color="primary" size="small" onClick={handleDownload}>
                        <DownloadIcon sx={{ color: "white" }} />
                    </Fab>
                </Stack>
            </Stack>

            <Grid container spacing={2}>
                {filtersVisible && (
                    <Grid item md={3} xs={12}>
                        <Stack direction="column">
                            <TreatmentFilters
                                studies={filteredStudiesForDrugs}
                                drugsMultiple={drugsMultiple}
                                drugsClearable={drugsClearable}
                                plasmodiumSpecies={plasmodiumSpecies}
                                drugs={drugs}
                                molecularMarker={molecularMarker}
                                years={years}
                                excludeLowerPatients={excludeLowerPatients}
                                onPlasmodiumSpeciesChange={onPlasmodiumChange}
                                onDrugsChange={onDrugsChange}
                                onMolecularMarkerChange={onMolecularMarkerChange}
                                onYearsChange={onYearsChange}
                                onExcludeLowerPatientsChange={onExcludeLowerPatientsChange}
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
            </Grid>
            <Modal
                open={openInfoModal}
                onClose={handleCloseInfoModal}
                aria-labelledby="info-modal"
                aria-describedby="adicional-info-modal"
            >
                <InfoModal>
                    <Typography
                        id="modal-modal-title"
                        variant="h5"
                        component="h2"
                        color="#2BA681"
                        textTransform={"uppercase"}
                        fontWeight="medium"
                        fontSize={{ xs: "15px", sm: "23px", md: "29px" }}
                    >
                        {title}
                    </Typography>
                    <IconButton
                        size={"small"}
                        onClick={handleCloseInfoModal}
                        sx={{ position: "absolute", top: "10px", right: "20px" }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Stack mt={3} gap={{ xs: 1, md: 3 }}>
                        <Typography fontSize={{ xs: "11px", md: "15px" }}>
                            <Trans i18nKey="common.dashboard.informationModal.chartInterpretation" t={t}>
                                <strong>Chart interpretation:</strong> This bar chart shows the number of therapeutic
                                efficacy studies conducted in a selected country (or countries). The user can customize
                                the chart by selecting one Plasmodium species, as well as selecting one or more drugs,
                                and year(s) of interest. The user can also exclude studies with less than 20 patients
                                from the chart. Studies with {">"}10% of patients with treatment failure are shown in
                                red; studies with {"<"}10% of patients with treatment failure are shown in pink.
                            </Trans>
                        </Typography>
                        <Typography fontSize={{ xs: "11px", md: "15px" }}>
                            <Trans i18nKey="common.dashboard.informationModal.dataAvailability" t={t}>
                                <strong>Data availability:</strong> All studies for which data are available are shown.
                            </Trans>
                        </Typography>
                        <Typography fontSize={{ xs: "11px", md: "15px" }}>
                            <Trans i18nKey="common.dashboard.informationModal.studyProtocol" t={t}>
                                <strong>Study protocol:</strong> WHO recommends that all therapeutic efficacy studies
                                are conducted according to the WHO. standard protocol.
                            </Trans>
                        </Typography>
                        <Typography fontSize={{ xs: "11px", md: "15px" }}>
                            <Trans i18nKey="common.dashboard.informationModal.info" t={t}>
                                To view more details about a specific study, return to the map interface to view the
                                site-level data.
                            </Trans>
                        </Typography>
                        <hr style={{ width: "100%" }}></hr>
                        <Stack>
                            <Typography fontSize={{ xs: "11px", md: "15px" }}>
                                <Trans i18nKey="common.dashboard.informationModal.dataPeriod" t={t}>
                                    <strong>Data period:</strong>
                                </Trans>{" "}
                                {years[0]}-{years[1]}
                            </Typography>
                            <Typography fontSize={{ xs: "11px", md: "15px" }}>
                                <Trans i18nKey="common.dashboard.informationModal.dataLastUpdated" t={t}>
                                    <strong>Data last updated:</strong>
                                </Trans>{" "}
                                05/11/2021
                            </Typography>
                        </Stack>
                    </Stack>
                </InfoModal>
            </Modal>
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
