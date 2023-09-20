import i18next from "i18next";
import _ from "lodash";
import * as R from "ramda";
import { TreatmentStudy } from "../../../../../../../domain/entities/TreatmentStudy";
import { percentile } from "../../../../../../components/Report/utils";
import { isNotNull } from "../../../../../../utils/number-utils";
import { TreatmentOverTimeTableData } from "../TreatmentOverTimeState";
import { TableData } from "./TableData";

export function createTreatmentTableData(
    studies: TreatmentStudy[],
    plasmodiumSpecies: string
): TreatmentOverTimeTableData {
    const countryStudyGroups = _.groupBy(studies, (study: TreatmentStudy) => `${study.ISO2}`);

    const rows: TableData[] = _.flatten(
        Object.entries(countryStudyGroups).map(([country, countryStudies]) => {
            const countrySpeciesGroup = _.groupBy(countryStudies, (study: TreatmentStudy) => `${study.DRUG_NAME}`);
            const entries = Object.entries(countrySpeciesGroup);
            let nStudies = 0;
            return _.flatten(
                entries.map(([drug, countrySpeciesStudies]) => {
                    const followUpCountrySpeciesGroup = _.groupBy(
                        countrySpeciesStudies,
                        (study: TreatmentStudy) => `${study.FOLLOW_UP}`
                    );

                    const followUpCountrySpeciesGroupStudies = Object.entries(followUpCountrySpeciesGroup);
                    nStudies += followUpCountrySpeciesGroupStudies.length;
                    return followUpCountrySpeciesGroupStudies.map(([followUpDays, followUpCountrySpeciesStudies]) => {
                        const yearSortedStudies = followUpCountrySpeciesStudies
                            .map((study: TreatmentStudy) => parseInt(study.YEAR_START))
                            .sort();
                        const minYear = yearSortedStudies[0];
                        const maxYear = yearSortedStudies[yearSortedStudies.length - 1];

                        const defaultProp = "TREATMENT_FAILURE_PP";
                        const fallbackProp = "TREATMENT_FAILURE_KM";

                        const rawValues = followUpCountrySpeciesStudies.map((study: TreatmentStudy) =>
                            isNotNull(study[defaultProp]) ? study[defaultProp] : study[fallbackProp]
                        );

                        const values = rawValues.map(value => parseFloat(value)).filter(value => !Number.isNaN(value));
                        const sortedValues = values.sort();

                        const min = values.length ? sortedValues[0] * 100 : "-";
                        const max = values.length ? sortedValues[values.length - 1] * 100 : "-";
                        const median = values.length ? R.median(sortedValues) * 100 : "-";
                        const percentile25 = values.length ? percentile(sortedValues, 0.25) * 100 : "-";
                        const percentile75 = values.length ? percentile(sortedValues, 0.75) * 100 : "-";

                        return {
                            ID: `${country}_${drug}`,
                            COUNTRY: i18next.t(`COUNTRY_NAME.${country}`),
                            ISO2: country,
                            DRUG: i18next.t(drug),
                            COUNTRY_NUMBER: nStudies,
                            FOLLOW_UP: followUpDays,
                            STUDY_YEARS: `${minYear} - ${maxYear}`,
                            NUMBER_OF_STUDIES: followUpCountrySpeciesStudies.length,
                            MEDIAN: median,
                            MIN: min,
                            MAX: max,
                            PERCENTILE_25: percentile25,
                            PERCENTILE_75: percentile75,
                        };
                    });
                })
            );
        })
    );

    return {
        kind: "TableData",
        rows,
        plasmodiumSpecies,
    };
}
