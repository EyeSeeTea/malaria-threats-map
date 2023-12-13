import { range, countBy, uniq } from "lodash";
import React from "react";

import { usePrevention } from "../../usePrevention";
import { SpreadOfResistanceOverTimeChartDataByClass } from "../types";
import { createBarChartData } from "./bar-chart/createBarChartData";
import { createLineChartData } from "./line-chart/createLineChartData";
import { sortInsecticideClasses } from "../../../../../components/filters/InsecticideClassFilter";
import { PreventionFiltersState } from "../../filters/PreventionFiltersState";

const baseFilters: ((study: any) => boolean)[] = [];

export function useSpreadResistanceOverTimeByInsecticideClass() {
    const { preventionStudies, filteredStudies, selectedCountries, filters } = usePrevention(baseFilters);

    const { disaggregateBySpeciesSelection, years, onInsecticideClassChange } = filters;

    const [lineChartDataByClass, setLineChartDataByClass] = React.useState<SpreadOfResistanceOverTimeChartDataByClass>({
        kind: "InsecticideByClass",
        data: { years: [], dataByCountry: {}, maxValue: 0 },
    });

    const [barChartDataByClass, setBarChartDataByClass] = React.useState<SpreadOfResistanceOverTimeChartDataByClass>({
        kind: "InsecticideByClass",
        data: { years: [], dataByCountry: {}, maxValue: 0 },
    });

    const [categoriesCountByInsecticideClass, setCategoriesCountByInsecticideClass] = React.useState<
        Record<string, number>
    >({});
    const [chartByClass, setChartByClass] = React.useState<"by-insecticide-class" | undefined>("by-insecticide-class");
    const [allInsecticideClasses, setAllInsecticideClasses] = React.useState<string[]>([]);
    const [multipleSelectedInsecticideClasses, setMultipleSelectedInsecticideClasses] = React.useState<string[]>([]);
    const [singleSelectedInsecticideClass, setSingleSelectedInsecticideClass] = React.useState<string | undefined>(
        undefined
    );

    const filteredStudiesWithoutNAInsecticideClassStudies = React.useMemo(
        () => filteredStudies.filter(study => study.INSECTICIDE_CLASS !== "NA"),
        [filteredStudies]
    );

    React.useEffect(() => {
        if (chartByClass) {
            onInsecticideClassChange([]);
        }
    }, [chartByClass, onInsecticideClassChange]);

    React.useEffect(() => {
        const insecticideClasses = sortInsecticideClasses(
            uniq(
                preventionStudies
                    .filter(study => study.INSECTICIDE_CLASS !== "NA")
                    .map(study => study.INSECTICIDE_CLASS)
            )
        );
        setAllInsecticideClasses(insecticideClasses);
        setMultipleSelectedInsecticideClasses(insecticideClasses);
        setSingleSelectedInsecticideClass(insecticideClasses[0]);
    }, [preventionStudies]);

    React.useEffect(() => {
        if (chartByClass) {
            const yearsRange = range(years[0], years[1] + 1);
            setLineChartDataByClass(
                createLineChartData(
                    filteredStudiesWithoutNAInsecticideClassStudies,
                    selectedCountries,
                    yearsRange,
                    multipleSelectedInsecticideClasses,
                    disaggregateBySpeciesSelection,
                    "by-insecticide-class"
                ) as SpreadOfResistanceOverTimeChartDataByClass
            );

            setBarChartDataByClass(
                createBarChartData(
                    filteredStudiesWithoutNAInsecticideClassStudies,
                    selectedCountries,
                    yearsRange,
                    singleSelectedInsecticideClass,
                    disaggregateBySpeciesSelection,
                    "by-insecticide-class"
                ) as SpreadOfResistanceOverTimeChartDataByClass
            );
        }
    }, [
        chartByClass,
        disaggregateBySpeciesSelection,
        filteredStudiesWithoutNAInsecticideClassStudies,
        multipleSelectedInsecticideClasses,
        selectedCountries,
        singleSelectedInsecticideClass,
        years,
    ]);

    React.useEffect(() => {
        if (chartByClass) {
            setCategoriesCountByInsecticideClass(
                countBy(filteredStudiesWithoutNAInsecticideClassStudies, "INSECTICIDE_CLASS")
            );
        } else {
            setCategoriesCountByInsecticideClass(undefined);
        }
    }, [filteredStudiesWithoutNAInsecticideClassStudies, chartByClass]);

    const onChartByClassChange = React.useCallback((type: "by-insecticide-class" | undefined) => {
        setChartByClass(type);
    }, []);

    return {
        allInsecticideClasses,
        multipleSelectedInsecticideClasses,
        singleSelectedInsecticideClass,
        setMultipleSelectedInsecticideClasses,
        setSingleSelectedInsecticideClass,
        categoriesCountByInsecticideClass,
        chartByClass,
        lineChartDataByClass,
        barChartDataByClass,
        onChartByClassChange,
        filtersByClass: {
            ...filters,
            onInsecticideClassesChange: undefined,
            onTypeChange: undefined,
            onInsecticideTypesChange: undefined,
        } as PreventionFiltersState,
    };
}
