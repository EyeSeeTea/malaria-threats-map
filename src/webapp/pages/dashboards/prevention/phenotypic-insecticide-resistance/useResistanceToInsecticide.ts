import i18next from "i18next";
import _ from "lodash";
import React from "react";
import { PreventionStudy } from "../../../../../domain/entities/PreventionStudy";
import { ResistanceStatusColors } from "../../../../components/layers/prevention/ResistanceStatus/symbols";
import { Option } from "../../common/types";
import { PreventionFiltersState } from "../filters/PreventionFiltersState";
import { ResistanceToInsecticideChartType } from "../types";
import { usePrevention } from "../usePrevention";
import { ResistanceToInsecticideSeriesGroup } from "./types";

const chartTypes: Option<ResistanceToInsecticideChartType>[] = [
    {
        label: i18next.t("By Insecticide Class"),
        value: "by-insecticide-class",
    },
    {
        label: i18next.t("By Insecticide"),
        value: "by-insecticide",
    },
];

export function useResistanceToInsecticide() {
    const {
        filteredStudies,
        filteredStudiesForInsecticide,
        selectedCountries,
        filters,
        onInsecticideClassChange,
        onInsecticideTypesChange,
        onYearsChange,
        onOnlyIncludeBioassaysWithMoreMosquitoesChange,
        onOnlyIncludeDataByHealthChange,
    } = usePrevention();

    const [data, setData] = React.useState<ResistanceToInsecticideSeriesGroup>({});
    const [categories, setCategories] = React.useState<string[]>([]);
    const [chartType, setChartType] = React.useState<ResistanceToInsecticideChartType>("by-insecticide-class");

    React.useEffect(() => {
        setData(createChartData(filteredStudies, selectedCountries, filters, chartType));
    }, [filteredStudies, selectedCountries, filters, chartType]);

    React.useEffect(() => {
        if (chartType === "by-insecticide-class") {
            setCategories(filters.insecticideClasses.map(insecticideClass => i18next.t(insecticideClass)));
        } else {
            setCategories(filters.insecticideTypes.map(insecticideType => i18next.t(insecticideType)));
        }
    }, [chartType, filters.insecticideClasses, filters.insecticideTypes]);

    React.useEffect(() => {
        if (chartType === "by-insecticide-class") {
            const insecticideClasses = _.uniq(filteredStudiesForInsecticide.map(study => study.INSECTICIDE_CLASS));
            onInsecticideClassChange(insecticideClasses);
            onInsecticideTypesChange([]);
        } else {
            const insecticideTypes = _.uniq(filteredStudiesForInsecticide.map(study => study.INSECTICIDE_TYPE));
            onInsecticideClassChange([]);
            onInsecticideTypesChange(insecticideTypes);
        }
    }, [chartType, onInsecticideClassChange, onInsecticideTypesChange, filteredStudiesForInsecticide]);

    const onChartTypeChange = React.useCallback((type: ResistanceToInsecticideChartType) => {
        setChartType(type);
    }, []);

    return {
        filteredStudies,
        filteredStudiesForInsecticide,
        chartTypes,
        chartType,
        categories,
        data,
        filters,
        onChartTypeChange,
        onInsecticideClassChange,
        onInsecticideTypesChange,
        onYearsChange,
        onOnlyIncludeBioassaysWithMoreMosquitoesChange,
        onOnlyIncludeDataByHealthChange,
    };
}

export function createChartData(
    studies: PreventionStudy[],
    selectedCountries: string[],
    filters: PreventionFiltersState,
    type: ResistanceToInsecticideChartType
): ResistanceToInsecticideSeriesGroup {
    const result = selectedCountries.reduce((acc, countryISO) => {
        const studiesByCountry = studies.filter(study => study.ISO2 === countryISO);

        const resistanceConfirmedStudies = studiesByCountry.filter(
            study => study.RESISTANCE_STATUS === "CONFIRMED_RESISTANCE"
        );

        const resistanceConfirmed = {
            type: "bar" as const,
            name: "Confirmed (0 to <90%)",
            color: ResistanceStatusColors.Confirmed[0],
            data:
                type === "by-insecticide-class"
                    ? getCountByInsecticideClass(resistanceConfirmedStudies, filters.insecticideClasses)
                    : getCountByInsecticideType(resistanceConfirmedStudies, filters.insecticideTypes),
        };

        const resistancePosibleStudies = studiesByCountry.filter(
            study => study.RESISTANCE_STATUS === "POSSIBLE_RESISTANCE"
        );

        const resistancePosible = {
            type: "bar" as const,
            name: "Possible (90 to <98%)",
            color: ResistanceStatusColors.Possible[0],
            data:
                type === "by-insecticide-class"
                    ? getCountByInsecticideClass(resistancePosibleStudies, filters.insecticideClasses)
                    : getCountByInsecticideType(resistancePosibleStudies, filters.insecticideTypes),
        };

        const resistanceSusceptibleStudies = studiesByCountry.filter(
            study => study.RESISTANCE_STATUS === "SUSCEPTIBLE"
        );

        const resistanceSusceptible = {
            type: "bar" as const,
            name: "Susceptible (≥98%)",
            color: ResistanceStatusColors.Susceptible[0],
            data:
                type === "by-insecticide-class"
                    ? getCountByInsecticideClass(resistanceSusceptibleStudies, filters.insecticideClasses)
                    : getCountByInsecticideType(resistanceSusceptibleStudies, filters.insecticideTypes),
        };

        return { ...acc, [countryISO]: [resistanceSusceptible, resistancePosible, resistanceConfirmed] };
    }, {});

    console.log({ result });

    return result;
}

function getCountByInsecticideClass(studies: PreventionStudy[], insecticideClasses: string[]) {
    return insecticideClasses.map(
        insecticideClass => studies.filter(study => study.INSECTICIDE_CLASS === insecticideClass).length
    );
}

function getCountByInsecticideType(studies: PreventionStudy[], insecticideTypes: string[]) {
    return insecticideTypes.map(
        insecticideType => studies.filter(study => study.INSECTICIDE_TYPE === insecticideType).length
    );
}
