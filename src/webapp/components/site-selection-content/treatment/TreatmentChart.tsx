import * as React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectTheme } from "../../../store/reducers/base-reducer";
import { State } from "../../../store/types";
import { SelectionData } from "../../../store/SelectionData";
import { ChartStyles } from "../../charts/Style";

const options: (data: any, categories: any[], translations: any) => Highcharts.Options = (
    data,
    categories,
    translations
) => ({
    chart: {
        height: 400,
        style: {
            ...ChartStyles,
        },
        scrollablePlotArea: {
            minWidth: 520,
            scrollPositionX: 1,
        },
        events: {
            // NOTICE: This solution is a workaround becuase scrollPositionX is not working as expected
            render() {
                const chart = this as Highcharts.Chart & { scrollingContainer?: HTMLElement };
                if (chart.scrollingContainer) {
                    chart.scrollingContainer.scrollLeft = chart.scrollingContainer.scrollWidth;
                }
            },
        },
    },
    tooltip: {
        enabled: true,
    },
    title: {
        text: "",
    },
    subtitle: {
        text: "",
    },
    xAxis: { categories },
    yAxis: {
        min: 0,
        max: 80,
        tickInterval: 10,
        title: {
            text: translations.percentage,
        },
    },
    plotOptions: {
        series: {
            lineWidth: 0,
            lineColor: "#FFFFFF", // Fix: show line when marker is selected
        },
    },
    series: data,
    legend: {
        itemStyle: {
            fontSize: "12px",
            fontWeight: "normal",
        },
        enabled: true,
        itemMarginTop: 12,
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
    selectionData?: SelectionData;
};
type Props = StateProps & OwnProps;

const TreatmentChart = ({ selectionData }: Props) => {
    const { t } = useTranslation();

    const data = React.useMemo(() => {
        if (selectionData.kind === "common" && selectionData.data.kind === "treatment") {
            return selectionData.data.data;
        } else {
            return null;
        }
    }, [selectionData]);

    const translations = {
        percentage: t("common.treatment.chart.treatment_failure.percentage"),
    };

    return (
        <React.Fragment>
            <HighchartsReact highcharts={Highcharts} options={options(data.series, data.years, translations)} />
        </React.Fragment>
    );
};
export default connect(mapStateToProps)(TreatmentChart);
