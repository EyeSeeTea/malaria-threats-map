import React from "react";
import styled from "styled-components";
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
import DisaggregateBySpeciesSelector from "../../../../components/filters/DisaggregateBySpecies";

export type PreventionFilterableChart =
    | "status-of-resistance-of-insecticide"
    | "mosquito-mortality-overtime"
    | "insecticide-resistance-resistance-mechanisms"
    | "spread-of-resistance-over-time";

interface PreventionFiltersProps {
    chart: PreventionFilterableChart;
    insecticideTypeOptions: Option[];
    filters: PreventionFiltersState;
    speciesOptions?: Option[];
    typeOptions?: Option[];
    onCollapse: () => void;
}

const PreventionFilters: React.FC<PreventionFiltersProps> = ({
    chart,
    insecticideTypeOptions,
    filters,
    speciesOptions,
    typeOptions,
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

            {filters.onInsecticideClassesChange && (
                <InsecticideClassSelector
                    onChange={filters.onInsecticideClassesChange}
                    value={filters.insecticideClasses}
                    type={
                        chart === "mosquito-mortality-overtime" || chart === "spread-of-resistance-over-time"
                            ? "radio"
                            : "select"
                    }
                />
            )}

            {chart === "spread-of-resistance-over-time" && filters.onInsecticideClassesChange && <StyledHr />}

            {speciesOptions && filters.onSpeciesChange && filters.onDisaggregateBySpeciesChange && (
                <DisaggregateBySpeciesSelector
                    onChange={filters.onDisaggregateBySpeciesChange}
                    value={filters.disaggregateBySpeciesSelection}
                />
            )}

            {speciesOptions && filters.onSpeciesChange && (
                <SpeciesSelector
                    labelPosition="top"
                    margin="10px 0px"
                    options={speciesOptions}
                    onChange={filters.onSpeciesChange}
                    value={filters.species}
                    isClearable={true}
                    disabled={filters.disableSpeciesFilter}
                />
            )}

            {filters.onTypeChange && (
                <SingleFilter
                    labelPosition={"top"}
                    margin={"10px 0px"}
                    label={t("common.filters.test_type")}
                    options={typeOptions}
                    onChange={filters.onTypeChange}
                    value={filters.type}
                />
            )}

            {filters.onInsecticideTypesChange && (
                <MultiFilter
                    labelPosition="top"
                    label={t("common.filters.insecticide_type")}
                    options={insecticideTypeOptions}
                    onChange={filters.onInsecticideTypesChange}
                    value={filters.insecticideTypes}
                    margin={"10px 0px"}
                    isClearable={true}
                    className="InsecticideTypeMultiSelector"
                />
            )}

            <DashboardsYearRangeSelector
                years={filters.years}
                maxMinYears={filters.maxMinYears}
                onChange={filters.onYearsChange}
            />
            <OnlyIncludeBioassaysWithMoreMosquitoes
                value={filters.onlyIncludeBioassaysWithMoreMosquitoes}
                onChange={filters.onOnlyIncludeBioassaysWithMoreMosquitoesChange}
            />
            <OnlyIncudeDataByHealth
                value={filters.onlyIncludeDataByHealth}
                onChange={filters.onOnlyIncludeDataByHealthChange}
            />
        </React.Fragment>
    );
};

export default React.memo(PreventionFilters);

const StyledHr = styled.hr`
    border: 0;
    height: 1px;
    background-color: #0000001a;
    width: 100%;
`;
