import { Button, Card, Grid, Stack } from "@mui/material";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import TreatmentFilters from "./filters/TreatmentFilters";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { TreatmentStudy } from "../../../../domain/entities/TreatmentStudy";
import InformationModal from "../../../components/dashboards/InformationModal";
import HighchartsReact from "highcharts-react-official";
import { toPng } from "html-to-image";
import { MolecularMarker } from "../../../components/filters/MolecularMarkerFilter";
import { useFiltersVisible } from "../common/filters/useFiltersVisible";
import DashboardTitle from "../common/DashboardTitle";

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
    excludeLowerPatients: boolean;
    onPlasmodiumChange: (value: string) => void;
    onDrugsChange: (value: string[]) => void;
    onYearsChange: (value: [number, number]) => void;
    onExcludeLowerPatientsChange: (value: boolean) => void;
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
    onPlasmodiumChange,
    onDrugsChange,
    onYearsChange,
    onExcludeLowerPatientsChange,
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
                                onPlasmodiumSpeciesChange={onPlasmodiumChange}
                                onDrugsChange={onDrugsChange}
                                onMolecularMarkerChange={onMolecularMarkerChange}
                                onYearsChange={onYearsChange}
                                onExcludeLowerPatientsChange={onExcludeLowerPatientsChange}
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
