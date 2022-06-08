import * as React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectTheme } from "../../../store/reducers/base-reducer";
import { State } from "../../../store/types";
import { SelectionData } from "../../../store/SelectionData";

const options: (data: any, categories: any[], translations: any) => Highcharts.Options = (
    data,
    categories,
    translations
) => ({
    chart: {
        height: 400,
        style: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif;',
        },
    },
    tooltip: {
        enabled: false,
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
        max: 60,
        tickInterval: 10,
        title: {
            text: translations.percentage,
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
        if (selectionData.data.kind === "treatment") {
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
