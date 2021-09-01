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
import IntensityInvolvementChart from "../common/IntensityInvolvementChart";

const options: (data: any, translations: any) => Highcharts.Options = (data, translations) => ({
    ...preventionChartOptions(data, translations),
    legend: {
        enabled: false,
    },
    credits: {
        enabled: false,
    },
});

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;
type OwnProps = {
    studies: PreventionStudy[];
};
type Props = StateProps & OwnProps;

const IntensityStatusChart = ({ studies: baseStudies }: Props) => {
    const { t } = useTranslation(); 
    const [study, setStudy] = useState(0);
    const groupedStudies = R.values(R.groupBy(R.prop("CITATION_URL"), baseStudies));
    const studies = groupedStudies[study];
    const sortedStudies = R.sortBy(study => -parseInt(study.YEAR_START), studies);
    
    const cleanedStudies = R.groupBy((study: PreventionStudy) => {
        return `${study.YEAR_START}, ${study.INSECTICIDE_TYPE} ${study.INSECTICIDE_INTENSITY}`;
    }, sortedStudies);

    const simplifiedStudies = R.values(cleanedStudies)
        .map(
            (groupStudies: PreventionStudy[]) => R.sortBy(study => -parseInt(study.MORTALITY_ADJUSTED), groupStudies)[0]
        )
        .sort((a, b) => a.INSECTICIDE_TYPE.localeCompare(b.INSECTICIDE_TYPE));

    const data = simplifiedStudies.map(study => ({
        name: `${study.YEAR_START}, ${t(study.INSECTICIDE_INTENSITY)} ${t(study.INSECTICIDE_TYPE)}`,
        y: Math.round(parseFloat(study.MORTALITY_ADJUSTED) * 100),
        species: study.SPECIES,
        number: study.NUMBER,
    }));
    const studyObject = simplifiedStudies[0];
    const translations = {
        mortality: t("common.prevention.chart.resistance_intensity.mortality"),
        mosquito_mortality: `${t("common.prevention.chart.resistance_intensity.mosquito_mortality")} (${t(
            "common.prevention.chart.resistance_intensity.number_of_tests"
        )})`,
        tested: t("common.prevention.chart.resistance_intensity.tested"),
    };

    return (
        <IntensityInvolvementChart studyObject={studyObject} groupedStudies={groupedStudies} setStudy={setStudy} study={study} options={options(data, translations)}/>

    );
};
export default connect(mapStateToProps)(IntensityStatusChart);
