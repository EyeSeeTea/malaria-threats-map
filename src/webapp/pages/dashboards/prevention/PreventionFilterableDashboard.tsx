import { Button, Card, Grid, Stack } from "@mui/material";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import HighchartsReact from "highcharts-react-official";
import PreventionFilters from "./filters/PreventionFilters";
import { PreventionFiltersState } from "./filters/PreventionFiltersState";
import { useFiltersVisible } from "../common/filters/useFiltersVisible";
import { downloadHtmlElement } from "../utils";
import DashboardTitle from "../common/DashboardTitle";

interface TreatmentFilterableDashboardProps {
    title: string;
    chartComponentRef?: React.MutableRefObject<HighchartsReact.RefObject>;
    filters: PreventionFiltersState;
    onYearsChange: (years: [number, number]) => void;
    onInsecticideClassesChange: (value: string[]) => void;
    onOnlyIncludeBioassaysWithMoreMosquitoesChange: (value: number) => void;
    onOnlyIncludeDataByHealthChange: (value: boolean) => void;
}

const PreventionFilterableDashboard: React.FC<TreatmentFilterableDashboardProps> = ({
    title,
    filters,
    onInsecticideClassesChange,
    onYearsChange,
    onOnlyIncludeBioassaysWithMoreMosquitoesChange,
    onOnlyIncludeDataByHealthChange,
    children,
    chartComponentRef,
}) => {
    const { filtersVisible, onChangeFiltersVisible } = useFiltersVisible();

    const { t } = useTranslation();

    const ref = useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const chart = chartComponentRef?.current?.chart;

        chart?.reflow();
    }, [filtersVisible, chartComponentRef]);

    const handleDownload = React.useCallback(() => {
        downloadHtmlElement(ref.current, title);
    }, [ref, title]);

    return (
        <React.Fragment>
            <DashboardTitle title={title} onDownloadClick={handleDownload} showActions={true} />

            <Grid container spacing={2}>
                {filtersVisible && (
                    <Grid item md={3} xs={12}>
                        <Stack direction="column">
                            <FiltersCard>
                                <PreventionFilters
                                    filters={filters}
                                    onInsecticideClassesChange={onInsecticideClassesChange}
                                    onYearsChange={onYearsChange}
                                    onOnlyIncludeBioassaysWithMoreMosquitoesChange={
                                        onOnlyIncludeBioassaysWithMoreMosquitoesChange
                                    }
                                    onOnlyIncludeDataByHealthChange={onOnlyIncludeDataByHealthChange}
                                    onCollapse={onChangeFiltersVisible}
                                />
                            </FiltersCard>
                            <StudiesCountCard elevation={0}>
                                {t("common.dashboard.therapeuticEfficacyDashboards.numStudies", {
                                    count: 0,
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
            </Grid>
        </React.Fragment>
    );
};

export default PreventionFilterableDashboard;

const DasboardCard = styled(Card)`
    min-height: 500px;
    padding: 42px;
`;

const StudiesCountCard = styled(Card)`
    padding: 24px;
`;

const FiltersCard = styled(Card)`
    min-height: 470px;
    margin-bottom: 15px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
`;
