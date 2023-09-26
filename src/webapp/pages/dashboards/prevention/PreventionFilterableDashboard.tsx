import { Button, Card, Grid, Stack, ToggleButtonGroup } from "@mui/material";
import React from "react";
import styled from "styled-components";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import HighchartsReact from "highcharts-react-official";
import PreventionFilters, { PreventionFilterableChart } from "./filters/PreventionFilters";
import { useFiltersVisible } from "../common/filters/useFiltersVisible";
import DashboardTitle from "../common/DashboardTitle";
import { Option } from "../common/types";
import { ResistanceToInsecticideChartType } from "./types";
import { PreventionFiltersState } from "./filters/PreventionFiltersState";
import CategoriesCount from "../common/CategoriesCount";
import { useTranslation } from "react-i18next";
import ScreenshotModal from "../../../components/ScreenshotModal";
import { ChartTypeOption } from "../common/chart-type-option/ChartTypeOption";

const SCREENSHOT_BACKGROUND_COLOR = "#F7F7F7";
const SCREENSHOT_EXCLUSION_CLASSES = ["dashboard-action"];

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
    onChartTypeChange?: (value: ResistanceToInsecticideChartType) => void;
    onInfoClick: () => void;
}

interface PreventionFilterableDashboardComponentProps extends PreventionFilterableDashboardProps {
    onScreenshot?: () => void;
    isScreenshot?: boolean;
}

const PreventionFilterableDashboardComponent: React.FC<PreventionFilterableDashboardComponentProps> = ({
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
    children,
    chartComponentRef,
    onChartTypeChange,
    onInfoClick,
    onScreenshot,
    isScreenshot = false,
}) => {
    const { filtersVisible, onChangeFiltersVisible } = useFiltersVisible();
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
        (_event: React.MouseEvent<HTMLElement>, value: ResistanceToInsecticideChartType) => {
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
                onDownloadClick={onScreenshot}
                onInfoClick={onInfoClick}
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

            <StyledGridContainer container spacing={2} $isScreenshot={isScreenshot}>
                {filtersVisible && (
                    <StyledGridItem item md={3} xs={12} $isScreenshot={isScreenshot}>
                        <Stack direction="column">
                            <FiltersCard $isScreenshot={isScreenshot}>
                                <PreventionFilters
                                    chart={chart}
                                    insecticideTypeOptions={insecticideTypeOptions}
                                    filters={filters}
                                    speciesOptions={speciesOptions}
                                    typeOptions={typeOptions}
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
            </StyledGridContainer>
        </Container>
    );
};

const PreventionFilterableDashboard: React.FC<PreventionFilterableDashboardProps> = props => {
    const [open, setOpen] = React.useState(false);

    const handleScreenshot = React.useCallback(() => {
        setOpen(true);
    }, []);

    const handleCloseScreenshot = React.useCallback(() => {
        setOpen(false);
    }, []);

    return (
        <>
            <PreventionFilterableDashboardComponent {...props} onScreenshot={handleScreenshot} />
            <ScreenshotModal
                open={open}
                onClose={handleCloseScreenshot}
                title={props.title}
                backgroundColor={SCREENSHOT_BACKGROUND_COLOR}
                exclusionClasses={SCREENSHOT_EXCLUSION_CLASSES}
            >
                <PreventionFilterableDashboardComponent {...props} isScreenshot />
            </ScreenshotModal>
        </>
    );
};

export default PreventionFilterableDashboard;

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

const FiltersCard = styled(Card)<{ $isScreenshot: boolean }>`
    min-height: 470px;
    margin-bottom: 15px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    .InsecticideClassMultiSelector,
    .InsecticideTypeMultiSelector {
        position: relative;
        .basic-select-container {
            overflow: ${props => (props?.$isScreenshot ? "initial" : "auto")};
            position: unset;
        }
        .MuiFormControl-root {
            max-height: ${props => (props?.$isScreenshot ? "initial" : "500px")};
        }
        .MuiPaper-root {
            margin-top: 10px;
        }
    }
`;
