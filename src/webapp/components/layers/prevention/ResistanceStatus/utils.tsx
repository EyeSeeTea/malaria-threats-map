import { DataLabelsFormatterCallbackFunction } from "highcharts";
import i18next from "i18next";
import _ from "lodash";
import * as R from "ramda";
import { PreventionStudy } from "../../../../../domain/entities/PreventionStudy";
import { Study } from "../../../../../domain/entities/Study";
import { isNotNull, isNull } from "../../../../utils/number-utils";
import { Option } from "../../../BasicSelect";
import { getSiteTitle } from "../../../site-title/utils";
import { ChartData, ChartDataItem, SelectionData } from "./ResistanceStatusChart";
import { ConfirmationStatusColors } from "./symbols";

export const resolveResistanceStatus = (percentage: number) => {
    if (percentage < 0.9) {
        return "Confirmed";
    } else if (percentage >= 0.9 && percentage < 0.98) {
        return "Possible";
    } else {
        return "Susceptible";
    }
};

export const chartOptions: (data: ChartDataItem[], translations: any) => Highcharts.Options = (data, translations) => ({
    chart: {
        maxPointWidth: 20,
        type: "bar",
        height: 90 + data.length * 40,
        style: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif;',
        },
    },
    title: {
        text: `<b>${translations.mosquito_mortality}</b>`,
        style: {
            fontSize: "11px",
        },
    },
    subtitle: {
        text: `<b>${translations.insecticideTypeLabel}</b>:${translations.insecticideType}`,
        style: {
            fontSize: "11px",
        },
    },
    xAxis: {
        type: "category",
        labels: {
            style: {
                whiteSpace: "nowrap",
            },
        },
    },
    yAxis: {
        min: 0,
        max: 100,
        tickInterval: 50,
        title: {
            text: "",
        },
        plotLines: [
            {
                value: 90,
                color: "#d43501",
                dashStyle: "Dash",
                width: 2,
                zIndex: 5,
                label: {
                    text: "",
                },
            },
        ],
    },
    plotOptions: {
        bar: {
            dataLabels: {
                formatter: function () {
                    // @ts-ignore
                    return `${this.y}% (${this.point.number})`;
                } as DataLabelsFormatterCallbackFunction,
                enabled: true,
                style: {
                    fontWeight: "normal",
                },
            },
            zones: [
                {
                    value: 90,
                    color: ConfirmationStatusColors.Confirmed[0],
                },
                {
                    value: 98,
                    color: ConfirmationStatusColors.Possible[0],
                },
                {
                    value: 100.001,
                    color: ConfirmationStatusColors.Susceptible[0],
                },
            ],
        },
    },
    tooltip: {
        enabled: false,
    },
    series: [
        {
            maxPointWidth: 20,
            type: "bar",
            name: translations.mortality,
            data: data,
        },
    ],
    legend: {
        enabled: false,
    },
    credits: {
        enabled: false,
    },
});

export const getTranslations = (insecticide_type: string) => ({
    mortality: i18next.t("common.prevention.chart.resistance_status.mortality"),
    mosquito_mortality: `${i18next.t("common.prevention.chart.resistance_status.mosquito_mortality")}(${i18next.t(
        "common.prevention.chart.resistance_status.number_of_tests"
    )})`,
    tested: i18next.t("common.prevention.chart.resistance_status.tested"),
    type: i18next.t("common.prevention.chart.resistance_status.type"),
    insecticideTypeLabel: i18next.t("common.prevention.chart.insecticide"),
    insecticideType: i18next.t(insecticide_type),
});

export function createSelectionData(
    theme: string,
    siteFilteredStudies: PreventionStudy[],
    siteNonFilteredStudies: PreventionStudy[],
    speciesFilter: Option[]
): SelectionData {
    return {
        title: siteFilteredStudies.length > 0 ? getSiteTitle(theme, siteFilteredStudies[0]) : "",
        chartData: createChartData(siteFilteredStudies, speciesFilter),
        dataSources: createCitationDataSources(theme, siteFilteredStudies),
        dataCurations: createCurations(siteFilteredStudies),
        othersDetected: otherInsecticideClasses(siteFilteredStudies, siteNonFilteredStudies),
    };
}

function createChartData(studies: PreventionStudy[], speciesFilter: Option[]): ChartData {
    const studiesFiltered = studies.filter(
        study => !speciesFilter || !speciesFilter.length || speciesFilter.map(s => s.value).includes(study.SPECIES)
    );

    const bySpeciesAndInsecticideType = _(studiesFiltered)
        .groupBy(({ SPECIES }) => SPECIES)
        .mapValues(studies => {
            return _(studies)
                .groupBy(({ INSECTICIDE_TYPE }) => INSECTICIDE_TYPE)
                .mapValues(studies => createChartDataItems(studies))
                .value();
        })
        .value();

    return bySpeciesAndInsecticideType;
}

function createChartDataItems(studies: PreventionStudy[]): ChartDataItem[] {
    const sortedStudies = R.sortBy(study => -parseInt(study.YEAR_START), studies);
    const cleanedStudies = R.groupBy((study: PreventionStudy) => {
        return `${study.YEAR_START}, ${study.INSECTICIDE_TYPE} ${study.INSECTICIDE_CONC}`;
    }, sortedStudies);

    const simplifiedStudies = R.sortWith(
        [R.ascend(R.prop("YEAR_START")), R.ascend(R.prop("INSECTICIDE_TYPE"))],
        R.values(cleanedStudies).map(
            (groupStudies: PreventionStudy[]) =>
                R.sortBy(study => parseFloat(study.MORTALITY_ADJUSTED), groupStudies)[0]
        )
    );
    const data = simplifiedStudies.map(study => ({
        name: `${study.YEAR_START}, ${i18next.t(study.INSECTICIDE_TYPE)} ${i18next.t(study.INSECTICIDE_CONC)}`,
        y: Math.round(parseFloat(study.MORTALITY_ADJUSTED) * 100),
        number: study.NUMBER,
    }));

    return data;
}

function createCitationDataSources(theme: string, studies: Study[]) {
    const studiesWithURL = studies.filter(study => isNotNull(study.CITATION_URL));
    const studiesWithoutURL = studies.filter(study => isNull(study.CITATION_URL));

    const valueOrUndefined = (value: string) => (isNull(value) ? undefined : value.trim());

    const dataSourcesWithUrl = _.uniqBy(studiesWithURL, study => study.CITATION_URL).map(study => {
        return {
            url: study.CITATION_URL,
            text: `${
                valueOrUndefined(study.CITATION_LONG) ||
                valueOrUndefined(study.CITATION) ||
                valueOrUndefined(study.INSTITUTION) ||
                valueOrUndefined(study.CITATION_URL)
            } ${study.INSTITUTION_CITY ? `, ${study.INSTITUTION_CITY}` : ""}`,
        };
    });

    const getCitation = (study: Study) => (theme === "invasive" ? study.CITATION : study.CITATION_LONG);

    const citations = _.uniq(
        studiesWithoutURL.filter(study => isNotNull(getCitation(study))).map(study => getCitation(study))
    );

    const institutes = _.uniq(
        studiesWithoutURL.filter(study => isNotNull(study.INSTITUTE)).map(study => study.INSTITUTE)
    );

    const institutions = _.uniq(
        studiesWithoutURL.filter(study => isNotNull(study.INSTITUTION)).map(study => study.INSTITUTION)
    );

    const restDataSources = theme !== "treatment" ? (citations.length > 0 ? citations : institutes) : institutions;

    const dataSources = [
        ...dataSourcesWithUrl,
        ...restDataSources.map(label => ({
            text: label,
        })),
    ];

    return dataSources;
}

function createCurations(studies: Study[]) {
    return _.uniq(
        studies
            .filter(study => isNotNull(study.INSTITUTE_CURATION || study.CURATION))
            .map(study => study.INSTITUTE_CURATION || study.CURATION)
    );
}

function otherInsecticideClasses(siteFilteredStudies: Study[], siteNonFilteredStudies: Study[]) {
    const currentInsecticideClasses = _.uniq(siteFilteredStudies.map(study => study.INSECTICIDE_CLASS));
    const otherInsecticideClasses = _.uniq(
        siteNonFilteredStudies
            .filter(
                study =>
                    !currentInsecticideClasses.includes(study.INSECTICIDE_CLASS) && isNotNull(study.INSECTICIDE_CLASS)
            )
            .map(study => study.INSECTICIDE_CLASS)
    );

    return otherInsecticideClasses;
}
