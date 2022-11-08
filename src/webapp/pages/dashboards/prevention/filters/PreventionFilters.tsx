import React from "react";
import { IconButton, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { PreventionFiltersState } from "./PreventionFiltersState";
import InsecticideClassSelector from "../../../../components/filters/InsecticideClassSelector";
import DashboardsYearRangeSelector from "../../common/filters/DashboardsYearRangeSelector";
import OnlyIncludeBioassaysWithMoreMosquitoes from "./OnlyIncludeBioassaysWithMoreMosquitoes";
import OnlyIncudeDataByHealth from "./OnlyIncudeDataByHealth";
import SpeciesSelector from "../../../../components/filters/SpeciesSelector";
import { Option } from "../../../../components/BasicSelect";
import SingleFilter from "../../../../components/filters/common/SingleFilter";
import MultiFilter from "../../../../components/filters/common/MultiFilter";

export type PreventionFilterableChart = "status-of-resistance-of-insecticide" | "mosquito-mortality-overtime";

interface PreventionFiltersProps {
    chart: PreventionFilterableChart;
    insecticideTypeOptions: Option[];
    filters: PreventionFiltersState;
    speciesOptions?: Option[];
    typeOptions?: Option[];
    onInsecticideClassesChange?: (value: string[]) => void;
    onSpeciesChange?: (value: string[]) => void;
    onInsecticideTypesChange?: (value: string[]) => void;
    onTypeChange?: (value: string) => void;
    onYearsChange: (years: [number, number]) => void;
    onOnlyIncludeBioassaysWithMoreMosquitoesChange: (value: number) => void;
    onOnlyIncludeDataByHealthChange: (value: boolean) => void;
    onCollapse: () => void;
}

const PreventionFilters: React.FC<PreventionFiltersProps> = ({
    chart,
    insecticideTypeOptions,
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
    onCollapse,
}) => {
    const { t } = useTranslation();

    return (
        <React.Fragment>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" textTransform="uppercase" fontWeight="bold" sx={{ width: "100%" }}>
                    {t("common.dashboard.treatmentFilters.title")}
                </Typography>

                <IconButton onClick={onCollapse} size="small">
                    <ArrowBackIosIcon />
                </IconButton>
            </Stack>

            {onInsecticideClassesChange && (
                <InsecticideClassSelector
                    onChange={onInsecticideClassesChange}
                    value={filters.insecticideClasses}
                    type={chart === "mosquito-mortality-overtime" ? "radio" : "select"}
                />
            )}

            {speciesOptions && onSpeciesChange && (
                <SpeciesSelector
                    labelPosition="top"
                    margin="10px 0px"
                    options={speciesOptions}
                    onChange={onSpeciesChange}
                    value={filters.species}
                    isClearable={true}
                />
            )}

            {onTypeChange && (
                <SingleFilter
                    labelPosition={"top"}
                    margin={"10px 0px"}
                    label={t("common.filters.test_type")}
                    options={typeOptions}
                    onChange={onTypeChange}
                    value={filters.type}
                />
            )}

            {onInsecticideTypesChange && (
                <MultiFilter
                    labelPosition="top"
                    label={t("common.filters.insecticide_type")}
                    options={insecticideTypeOptions}
                    onChange={onInsecticideTypesChange}
                    value={filters.insecticideTypes}
                    margin={"10px 0px"}
                    isClearable={true}
                />
            )}

            <DashboardsYearRangeSelector years={filters.years} onChange={onYearsChange} />
            <OnlyIncludeBioassaysWithMoreMosquitoes
                value={filters.onlyIncludeBioassaysWithMoreMosquitoes}
                onChange={onOnlyIncludeBioassaysWithMoreMosquitoesChange}
            />
            <OnlyIncudeDataByHealth
                value={filters.onlyIncludeDataByHealth}
                onChange={onOnlyIncludeDataByHealthChange}
            />
        </React.Fragment>
    );
};

export default React.memo(PreventionFilters);
