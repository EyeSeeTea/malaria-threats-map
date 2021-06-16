import * as React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectTheme } from "../../../../store/reducers/base-reducer";
import { State } from "../../../../store/types";
import * as R from "ramda";
import { resolveResistanceStatus } from "./utils";
import { ConfirmationStatusColors } from "./symbols";
import { setCountryModeAction, setRegionAction } from "../../../../store/actions/base-actions";
import { selectPreventionFilters } from "../../../../store/reducers/prevention-reducer";
import { formatYears } from "../../../../utils/string-utils";
import { Actions, ChartContainer, FlexGrow, ZoomButton } from "../../../Chart";
import { PreventionStudy } from "../../../../../domain/entities/PreventionStudy";
import statusCountryChartOptions from "../common/countryChartOptions";

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

const ResistanceStatusCountryChart = ({ studies, setRegion, setCountryMode, preventionFilters }: Props) => {
    const { t } = useTranslation();
    const nStudies = studies.length;
    const sortedStudies = R.sortBy(study => parseInt(study.YEAR_START), studies);
    const maxYear = sortedStudies[sortedStudies.length - 1].YEAR_START;
    const minYear = sortedStudies[0].YEAR_START;
    const richStudies = sortedStudies.map(study => {
        const percentage = parseFloat(study["MORTALITY_ADJUSTED"]);
        return {
            ...study,
            CONFIRMATION_STATUS: resolveResistanceStatus(percentage),
        };
    });
    const data = Object.entries(R.groupBy((study: any) => study.CONFIRMATION_STATUS, richStudies)).map(
        ([status, studies]: any[]) => ({
            name: t(`common.prevention.chart.resistance_status.${status}`),
            y: studies.length,
            color: ConfirmationStatusColors[status][0],
        })
    );
    const onClick = () => {
        setRegion({ country: studies[0].ISO2 });
        setCountryMode(false);
    };

    const labels = {
        title: t("common.prevention.resistance_status"),
        numberOfTests: t("common.prevention.chart.resistance_status.number_of_tests"),
        chartStudies: t("common.chart.studies"),
    };
    return (
        <ChartContainer>
            <Typography variant="subtitle1">
                <Box fontWeight="fontWeightBold">{`${t(
                    `common.${studies[0].ISO2 === "NA" ? "COUNTRY_NA" : studies[0].ISO2}`
                )}`}</Box>
            </Typography>
            <Typography variant="subtitle2">
                {t("common.prevention.chart.resistance_status.content_1", {
                    nStudies,
                })}
                <i>Anopheles</i>
                {t("common.prevention.chart.resistance_status.content_2", {
                    insecticideClass: t(`common.${preventionFilters.insecticideClass}`),
                    years: formatYears(minYear, maxYear),
                })}
            </Typography>
            <HighchartsReact highcharts={Highcharts} options={statusCountryChartOptions(data, labels)} />
            <Actions>
                <FlexGrow />
                <ZoomButton onClick={onClick} />
            </Actions>
        </ChartContainer>
    );
};
export default connect(mapStateToProps, mapDispatchToProps)(ResistanceStatusCountryChart);
