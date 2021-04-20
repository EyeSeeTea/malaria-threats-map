import * as React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {Box, Typography} from "@material-ui/core";
import {connect} from "react-redux";
import {useTranslation} from "react-i18next";
import {selectTheme} from "../../../../store/reducers/base-reducer";
import {State} from "../../../../store/types";
import * as R from "ramda";
import {IntensityStatusColors} from "./symbols";
import {setCountryModeAction, setRegionAction} from "../../../../store/actions/base-actions";
import {INTENSITY_STATUS} from "./utils";
import {selectPreventionFilters} from "../../../../store/reducers/prevention-reducer";
import {formatYears} from "../../../../utils/string-utils";
import {Actions, ChartContainer, FlexGrow, ZoomButton} from "../../../Chart";
import {PreventionStudy} from "../../../../../domain/entities/PreventionStudy";

const options: (data: any, translations: any) => Highcharts.Options = (data, translations) => ({
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: "pie",
        height: 250,
        style: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif;',
        },
    },
    title: {
        text: `<b>${translations.resistance_intensity}</b> (${translations.number_of_tests})`,
    },
    tooltip: {
        pointFormat: "{series.name}: <b>{point.y}</b>",
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: "pointer",
            dataLabels: {
                enabled: true,
                format: "<b>{point.name}</b>: {point.y}",
            },
        },
    },
    series: [
        {
            type: "pie",
            innerSize: "50%",
            name: translations.studies,
            colorByPoint: true,
            data,
        },
    ],
    legend: {
        enabled: true,
    },
    credits: {
        enabled: false,
    },
});

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    preventionFilters: selectPreventionFilters(state),
});
const mapDispatchToProps = {
    setRegion: setRegionAction,
    setCountryMode: setCountryModeAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = {
    studies: PreventionStudy[];
};
type Props = DispatchProps & StateProps & OwnProps;

const IntensityStatusCountryChart = ({
    studies,
    setRegion,
    setCountryMode,
    preventionFilters,
}: Props) => {
    const {t} = useTranslation("common");
    const nStudies = studies.length;
    const sortedStudies = R.sortBy((study) => parseInt(study.YEAR_START), studies);
    const maxYear = sortedStudies[sortedStudies.length - 1].YEAR_START;
    const minYear = sortedStudies[0].YEAR_START;
    const richStudies = sortedStudies.map((study) => {
        return {
            ...study,
        };
    });
    const data = Object.entries(
        R.groupBy((study: any) => study.RESISTANCE_INTENSITY, richStudies)
    ).map(([status, studies]: any[]) => {
        return {
            name: t(`prevention.chart.resistance_intensity.${status}`),
            y: studies.length,
            color: (IntensityStatusColors[status] ||
                IntensityStatusColors[INTENSITY_STATUS.UNKNOWN])[0],
        };
    });
    const onClick = () => {
        setRegion({country: studies[0].ISO2});
        setCountryMode(false);
    };
    const translations = {
        studies: t("chart.studies"),
        resistance_intensity: t("prevention.resistance_intensity"),
        number_of_tests: t("prevention.chart.resistance_intensity.number_of_tests"),
    };
    return (
        <ChartContainer>
            <Typography variant="subtitle1">
                <Box fontWeight="fontWeightBold">{`${t(
                    studies[0].ISO2 === "NA" ? "COUNTRY_NA" : studies[0].ISO2
                )}`}</Box>
            </Typography>
            <Typography variant="subtitle2">
                {t(`prevention.chart.resistance_intensity.content_1`, {
                    nStudies: nStudies,
                })}
                <i>Anopheles</i>
                {t(`prevention.chart.resistance_intensity.content_2`, {
                    insecticideClass: t(preventionFilters.insecticideClass),
                    years: formatYears(minYear, maxYear),
                })}
            </Typography>
            <HighchartsReact highcharts={Highcharts} options={options(data, translations)} />
            <Actions>
                <FlexGrow />
                <ZoomButton onClick={onClick} />
            </Actions>
        </ChartContainer>
    );
};
export default connect(mapStateToProps, mapDispatchToProps)(IntensityStatusCountryChart);
