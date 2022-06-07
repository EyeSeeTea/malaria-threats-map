import * as React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectTheme } from "../../../store/reducers/base-reducer";
import { State } from "../../../store/types";
import { selectTreatmentFilters } from "../../../store/reducers/treatment-reducer";
import { SelectionData } from "../../../store/SelectionData";

const options: (data: any, categories: any[], translations: any) => Highcharts.Options = (
    data,
    categories,
    translations
) => ({
    chart: {
        maxPointWidth: 20,
        type: "bar",
        height: 250,
        style: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif;',
        },
    },
    title: {
        text: translations.percentage,
        style: {
            fontSize: "14px",
            fontWeight: "bold",
        },
    },
    xAxis: { categories },
    yAxis: {
        min: 0,
        max: 100,
        tickInterval: 50,
        title: {
            text: "",
        },
        stackLabels: {
            style: {
                fontWeight: "bold",
                color:
                    // theme
                    (Highcharts.defaultOptions.title.style && Highcharts.defaultOptions.title.style.color) || "gray",
            },
        },
    },
    tooltip: {
        headerFormat: "<span style='color:grey;font-size:11px;'>{point.x}</span><br/>",
        pointFormat: "{series.name}: &nbsp;&nbsp;<b style='font-size:16px'>{point.y}%</b>",
        style: {
            width: 200,
        },
    },
    plotOptions: {
        series: {
            stacking: "normal",
        },
    },
    series: data,
    legend: {
        enabled: true,
        align: "right",
        verticalAlign: "top",
        layout: "vertical",
        width: 70,
    },
    credits: {
        enabled: false,
    },
});

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    treatmentFilters: selectTreatmentFilters(state),
});
const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = {
    selectionData: SelectionData;
};
type Props = DispatchProps & StateProps & OwnProps;

const MolecularMarkersChart = ({ selectionData }: Props) => {
    const { t } = useTranslation();

    const data = React.useMemo(() => {
        if (selectionData.data.kind === "treatment-molecular-markers") {
            return selectionData.data.data;
        } else {
            return null;
        }
    }, [selectionData]);

    const translations = {
        percentage: t("common.treatment.chart.molecular_markers.percentage"),
    };

    console.log({ series: data.series, years: data.years });

    return <HighchartsReact highcharts={Highcharts} options={options(data.series, data.years, translations)} />;
};
export default connect(mapStateToProps, mapDispatchToProps)(MolecularMarkersChart);
