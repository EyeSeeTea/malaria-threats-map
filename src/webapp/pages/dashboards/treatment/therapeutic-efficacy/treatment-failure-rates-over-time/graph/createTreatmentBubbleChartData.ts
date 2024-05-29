import i18next from "i18next";
import _ from "lodash";
import { TreatmentStudy } from "../../../../../../../domain/entities/TreatmentStudy";
import { TreatmentOverTimeGraphData, TreatmentOverTimeType } from "../TreatmentOverTimeState";

const treatmentdashboardColors = ["#7EA0C3", "#FEAF59", "#F78185", "#94CFCA", "#7BC280"];

export function createTreatmentBubbleChartData(
    studies: TreatmentStudy[],
    type: TreatmentOverTimeType,
    yearsFilter: [number, number]
): TreatmentOverTimeGraphData {
    const countries = _.uniq(studies.map(study => study.ISO2));

    const years = _.range(yearsFilter[0], yearsFilter[1] + 1);

    const series = countries.map((iso2, index) => {
        const studiesByCountry = studies.filter(study => study.ISO2 === iso2);
        const yearsWithStudies = _.uniq(studiesByCountry.map(study => +study.YEAR_START));
        const yearsWithoutStudies = years.filter(year => !yearsWithStudies.includes(year));
        const emptyStudies = yearsWithoutStudies.map(year => {
            return {
                YEAR_START: year,
                TREATMENT_FAILURE_PP: -1,
                TREATMENT_FAILURE_KM: -1,
                POSITIVE_DAY_3: -1,
                SITE_NAME: "",
                ISO2: "",
                DRUG_NAME: "",
                N: 0,
                CITATION_URL: "",
                INSTITUTION: "",
            };
        });

        const finalStudies = [...studiesByCountry, ...emptyStudies];

        return {
            type: "bubble" as const,
            name: i18next.t(`countries.${iso2}`, { defaultValue: i18next.t(iso2) }),
            color: index <= treatmentdashboardColors.length - 1 ? treatmentdashboardColors[index] : "#000000",
            data: finalStudies.map(study => {
                const rawValue =
                    type === "treatmentFailure"
                        ? study.TREATMENT_FAILURE_PP || study.TREATMENT_FAILURE_KM
                        : study.POSITIVE_DAY_3;

                const fixedRawValue = isNaN(rawValue) ? -1 : rawValue;

                const value = +(fixedRawValue * 100).toFixed(2);

                const fixedValue = value > 100 ? 100 : value;

                return {
                    x: +study.YEAR_START,
                    y: fixedValue,
                    z: +study.N,
                    site: study.SITE_NAME,
                    country: study.ISO2,
                    drug: study.DRUG_NAME,
                    url: study.CITATION_URL,
                    urlText: study.INSTITUTION,
                };
            }),
        };
    });

    return {
        kind: "GraphData",
        series: _.orderBy(series, ["name"]),
    };
}
