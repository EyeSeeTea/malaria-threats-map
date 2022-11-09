import { Button, Card, Grid, Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";
import React, { useRef } from "react";
import styled from "styled-components";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import HighchartsReact from "highcharts-react-official";
import PreventionFilters, { PreventionFilterableChart } from "./filters/PreventionFilters";
import { useFiltersVisible } from "../common/filters/useFiltersVisible";
import { downloadHtmlElement } from "../utils";
import DashboardTitle from "../common/DashboardTitle";
import { Option } from "../common/types";
import { ResistanceToInsecticideChartType } from "./types";
import { PreventionFiltersState } from "./filters/PreventionFiltersState";
import CategoriesCount from "../common/CategoriesCount";
import { useTranslation } from "react-i18next";

interface PreventionFilterableDashboardProps {
    id?: string;
    chart: PreventionFilterableChart;
    chartTypes?: Option<ResistanceToInsecticideChartType>[];
    chartType?: ResistanceToInsecticideChartType;
    speciesOptions?: Option<string>[];
    typeOptions?: Option<string>[];
    insecticideTypeOptions?: Option<string>[];
    title: string;
    count: number | Record<string, number>;
    chartComponentRef?: React.MutableRefObject<HighchartsReact.RefObject[] | HighchartsReact.RefObject>;
    filters: PreventionFiltersState;
    onYearsChange: (years: [number, number]) => void;
    onInsecticideClassesChange?: (value: string[]) => void;
    onSpeciesChange?: (value: string[]) => void;
    onTypeChange?: (value: string) => void;
    onInsecticideTypesChange?: (value: string[]) => void;
    onOnlyIncludeBioassaysWithMoreMosquitoesChange: (value: number) => void;
    onOnlyIncludeDataByHealthChange: (value: boolean) => void;
    onChartTypeChange?: (value: ResistanceToInsecticideChartType) => void;
    onInfoClick: () => void;
}

const PreventionFilterableDashboard: React.FC<PreventionFilterableDashboardProps> = ({
    id,
    chart,
    chartTypes,
    chartType,
    insecticideTypeOptions,
    title,
    count,
    filters,
    speciesOptions,
    typeOptions,
    onInsecticideClassesChange,
    onSpeciesChange,
    onInsecticideTypesChange,
    onTypeChange,
    onYearsChange,
    onOnlyIncludeBioassaysWithMoreMosquitoesChange,
    onOnlyIncludeDataByHealthChange,
    children,
    chartComponentRef,
    onChartTypeChange,
    onInfoClick,
}) => {
    const { filtersVisible, onChangeFiltersVisible } = useFiltersVisible();
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

    const handleChartTypeChange = React.useCallback(
        (_event: React.MouseEvent<HTMLElement>, value: ResistanceToInsecticideChartType) => {
            if (onChartTypeChange) {
                onChartTypeChange(value);
            }
        },
        [onChartTypeChange]
    );

    return (
        <React.Fragment>
            <DashboardTitle
                id={id}
                title={title}
                onDownloadClick={handleDownload}
                onInfoClick={onInfoClick}
                showActions={true}
            />

            {chartTypes && (
                <ToggleButtonGroup
                    value={chartType}
                    exclusive
                    onChange={handleChartTypeChange}
                    aria-label="text alignment"
                    sx={{ marginBottom: 2 }}
                >
                    {chartTypes.map(type => {
                        return (
                            <StyledToggleButton key={type.value} value={type.value}>
                                {type.label}
                            </StyledToggleButton>
                        );
                    })}
                </ToggleButtonGroup>
            )}

            <Grid container spacing={2} ref={ref}>
                {filtersVisible && (
                    <Grid item md={3} xs={12}>
                        <Stack direction="column">
                            <FiltersCard>
                                <PreventionFilters
                                    chart={chart}
                                    insecticideTypeOptions={insecticideTypeOptions}
                                    filters={filters}
                                    speciesOptions={speciesOptions}
                                    typeOptions={typeOptions}
                                    onInsecticideClassesChange={onInsecticideClassesChange}
                                    onSpeciesChange={onSpeciesChange}
                                    onInsecticideTypesChange={onInsecticideTypesChange}
                                    onTypeChange={onTypeChange}
                                    onYearsChange={onYearsChange}
                                    onOnlyIncludeBioassaysWithMoreMosquitoesChange={
                                        onOnlyIncludeBioassaysWithMoreMosquitoesChange
                                    }
                                    onOnlyIncludeDataByHealthChange={onOnlyIncludeDataByHealthChange}
                                    onCollapse={onChangeFiltersVisible}
                                />
                            </FiltersCard>
                            <StudiesCountCard elevation={0}>
                                {typeof count === "number" ? (
                                    t("common.dashboard.phenotypicInsecticideResistanceDashboards.numBioassays", {
                                        count,
                                    })
                                ) : (
                                    <CategoriesCount counts={count} />
                                )}
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
                        <div>{children}</div>
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

const StyledToggleButton = styled(ToggleButton)`
    border-radius: 5px !important;
    margin-right: 16px;
    padding: 16px 32px;
    color: black;
    background-color: white;
    border: 0px;
    &.Mui-selected {
        color: white;
        background-color: #2fb3af;
    }
`;
