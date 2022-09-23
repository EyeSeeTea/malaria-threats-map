import React from "react";
import { IconButton, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { PreventionFiltersState } from "./PreventionFiltersState";
import InsecticideClassSelector from "../../../../components/filters/InsecticideClassSelector";
import DashboardsYearRangeSelector from "../../common/filters/DashboardsYearRangeSelector";
import OnlyIncludeBioassaysWithMoreMosquitoes from "./OnlyIncludeBioassaysWithMoreMosquitoes";
import OnlyIncudeDataByHealth from "./OnlyIncudeDataByHealth";
import InsecticideTypeSelector from "../../../../components/filters/InsecticideTypeSelector";
import { PreventionStudy } from "../../../../../domain/entities/PreventionStudy";

interface PreventionFiltersProps {
    studies: PreventionStudy[];
    filters: PreventionFiltersState;
    onInsecticideClassesChange?: (value: string[]) => void;
    onInsecticideTypesChange?: (value: string[]) => void;
    onYearsChange: (years: [number, number]) => void;
    onOnlyIncludeBioassaysWithMoreMosquitoesChange: (value: number) => void;
    onOnlyIncludeDataByHealthChange: (value: boolean) => void;
    onCollapse: () => void;
}

const PreventionFilters: React.FC<PreventionFiltersProps> = ({
    studies,
    filters,
    onInsecticideClassesChange,
    onInsecticideTypesChange,
    onYearsChange,
    onOnlyIncludeBioassaysWithMoreMosquitoesChange,
    onOnlyIncludeDataByHealthChange,
    onCollapse,
}) => {
    const { t } = useTranslation();

    return (
        <React.Fragment>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" textTransform="uppercase" fontWeight="bold">
                    {t("common.dashboard.treatmentFilters.title")}
                </Typography>

                <IconButton onClick={onCollapse} size="small">
                    <ArrowBackIosIcon />
                </IconButton>
            </Stack>

            {onInsecticideClassesChange && (
                <InsecticideClassSelector onChange={onInsecticideClassesChange} value={filters.insecticideClasses} />
            )}

            {onInsecticideTypesChange && (
                <InsecticideTypeSelector
                    studies={studies}
                    onChange={onInsecticideTypesChange}
                    value={filters.insecticideTypes}
                    insecticideClassesFilter={filters.insecticideClasses}
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
