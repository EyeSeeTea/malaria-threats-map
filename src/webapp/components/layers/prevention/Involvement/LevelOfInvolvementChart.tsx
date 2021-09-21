import * as React from "react";
import { useState } from "react";
import Highcharts from "highcharts";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectTheme } from "../../../../store/reducers/base-reducer";
import { State } from "../../../../store/types";
import * as R from "ramda";
import { PreventionStudy } from "../../../../../domain/entities/PreventionStudy";
import preventionChartOptions from "../common/preventionChartOptions";
import { LevelOfInvolvementColors } from "./symbols";
import IntensityInvolvementChart from "../common/IntensityInvolvementChart";

const zones = [
    {
        value: 90,
        color: LevelOfInvolvementColors.NO_INVOLVEMENT[0],
    },
    {
        value: 98,
        color: LevelOfInvolvementColors.PARTIAL_INVOLVEMENT[0],
    },
    {
        value: 100.001,
        color: LevelOfInvolvementColors.FULL_INVOLVEMENT[0],
    },
];

const options: (data: any, translations: any) => Highcharts.Options = (data, translations) => ({
    ...preventionChartOptions(data, translations, zones),
});

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;
type OwnProps = {
    studies: PreventionStudy[];
};
type Props = StateProps & OwnProps;

const LevelOfInvolvementChart = ({ studies: baseStudies }: Props) => {
    const { t } = useTranslation();
    const [study, setStudy] = useState(0);
    const groupedStudies = R.values(R.groupBy(R.prop("CITATION_URL"), baseStudies));
    const studies = groupedStudies[study];

    const sortedStudies = R.sortBy(study => parseInt(study.YEAR_START), studies);

    const data = sortedStudies.map(study => {
        const base = `${study.YEAR_START}, ${t(study.INSECTICIDE_TYPE)} ${t(study.INSECTICIDE_CONC)}`;
        const syn =
            study.SYNERGIST_TYPE === "NO"
                ? t("common.prevention.chart.synergist_involvement.no_synergist")
                : `${t(study.SYNERGIST_TYPE)} ${t(study.SYNERGIST_CONC)}`;
        return {
            name: `${base}, ${syn}`,
            y: Math.round(parseFloat(study.MORTALITY_ADJUSTED) * 100),
            species: study.SPECIES,
            number: study.NUMBER,
        };
    });
    const studyObject = sortedStudies[study];
    const translations = {
        mortality: t("common.prevention.chart.synergist_involvement.mortality"),
        mosquito_mortality: `${t("common.prevention.chart.synergist_involvement.mosquito_mortality")} (${t(
            "common.prevention.chart.synergist_involvement.number_of_tests"
        )})`,
        tested: t("common.prevention.chart.synergist_involvement.tested"),
    };

    return (
        <IntensityInvolvementChart
            studyObject={studyObject}
            groupedStudies={groupedStudies}
            setStudy={setStudy}
            study={study}
            options={options(data, translations)}
        />
    );
};
export default connect(mapStateToProps)(LevelOfInvolvementChart);
