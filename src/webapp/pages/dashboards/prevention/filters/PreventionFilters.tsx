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
    isCollapseDisabled?: boolean;
    isInsecticideClassSelectorDisabled?: boolean;
    isSpeciesSelectorDisabled?: boolean;
    isTypeFilterDisabled?: boolean;
    isInsecticideTypesDisabled?: boolean;
    isDashboardsYearRangeSelectorDisabled?: boolean;
    isOnlyIncludeBioassaysWithMoreMosquitoesDisabled?: boolean;
    isOnlyIncudeDataByHealthDisabled?: boolean;
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
    isCollapseDisabled = false,
    isInsecticideClassSelectorDisabled = false,
    isSpeciesSelectorDisabled = false,
    isTypeFilterDisabled = false,
    isInsecticideTypesDisabled = false,
    isDashboardsYearRangeSelectorDisabled = false,
    isOnlyIncludeBioassaysWithMoreMosquitoesDisabled = false,
    isOnlyIncudeDataByHealthDisabled = false,
}) => {
    const { t } = useTranslation();

    return (
        <React.Fragment>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" textTransform="uppercase" fontWeight="bold" sx={{ width: "100%" }}>
                    {t("common.dashboard.treatmentFilters.title")}
                </Typography>

                <IconButton onClick={onCollapse} size="small" disabled={isCollapseDisabled}>
                    <ArrowBackIosIcon />
                </IconButton>
            </Stack>

            {onInsecticideClassesChange && (
                <InsecticideClassSelector
                    onChange={onInsecticideClassesChange}
                    value={filters.insecticideClasses}
                    type={chart === "mosquito-mortality-overtime" ? "radio" : "select"}
                    isDisabled={isInsecticideClassSelectorDisabled}
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
                    isDisabled={isSpeciesSelectorDisabled}
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
                    isDisabled={isTypeFilterDisabled}
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
                    isDisabled={isInsecticideTypesDisabled}
                />
            )}

            <DashboardsYearRangeSelector years={filters.years} onChange={onYearsChange} isDisabled={isDashboardsYearRangeSelectorDisabled} />
            <OnlyIncludeBioassaysWithMoreMosquitoes
                value={filters.onlyIncludeBioassaysWithMoreMosquitoes}
                onChange={onOnlyIncludeBioassaysWithMoreMosquitoesChange}
                isDisabled={isOnlyIncludeBioassaysWithMoreMosquitoesDisabled}
            />
            <OnlyIncudeDataByHealth
                value={filters.onlyIncludeDataByHealth}
                onChange={onOnlyIncludeDataByHealthChange}
                isDisabled={isOnlyIncudeDataByHealthDisabled}
            />
        </React.Fragment>
    );
};

export default React.memo(PreventionFilters);
