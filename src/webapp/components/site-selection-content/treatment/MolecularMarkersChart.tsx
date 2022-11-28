import * as React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectTheme } from "../../../store/reducers/base-reducer";
import { State } from "../../../store/types";
import { selectTreatmentFilters } from "../../../store/reducers/treatment-reducer";
import { SelectionData } from "../../../store/SelectionData";
import { Box, Divider, Typography } from "@mui/material";
import styled from "styled-components";
import { ChartStyles } from "../../charts/Style";

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
        if (selectionData.kind === "common" && selectionData.data.kind === "treatment-molecular-markers") {
            return selectionData.data.data;
        } else {
            return null;
        }
    }, [selectionData]);

    const translations = {
        percentage: t("common.treatment.chart.molecular_markers.percentage"),
    };

    return (
        <React.Fragment>
            {Object.keys(data.markers).map((group, groupIndex) => {
                return (
                    <React.Fragment key={group}>
                        <MarkerGroupContainer>
                            <MarkerLabel>{group}</MarkerLabel>
                            <Grid>
                                {data.markers[group].length > 0 ? (
                                    data.markers[group].map(item => {
                                        return (
                                            <MarkerContainer key={item.name}>
                                                <MarkerColor width={10} height={10} background={item.color} />
                                                <Typography variant="caption">{item.name}</Typography>
                                            </MarkerContainer>
                                        );
                                    })
                                ) : (
                                    <span style={{ marginTop: "8px" }}>{"None"}</span>
                                )}
                            </Grid>
                        </MarkerGroupContainer>
                        {groupIndex < Object.keys(data.markers).length - 1 ? <Divider /> : null}
                    </React.Fragment>
                );
            })}
            <Divider sx={{ marginBottom: 2 }} />
            <HighchartsReact highcharts={Highcharts} options={options(data.series, data.years, translations)} />
        </React.Fragment>
    );
};
export default connect(mapStateToProps, mapDispatchToProps)(MolecularMarkersChart);

const options: (data: any, categories: any[], translations: any) => Highcharts.Options = (
    data,
    categories,
    translations
) => ({
    chart: {
        maxPointWidth: 20,
        type: "bar",
        height: 250,
        marginRight: 40,
        style: {
            ...ChartStyles,
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
        enabled: false,
    },
    credits: {
        enabled: false,
    },
});

const MarkerGroupContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin: 0px;
    padding: 0px;
`;

const Grid = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin: 0px;
    padding: 4px;
    width: 70%;
`;

const MarkerLabel = styled(Typography)`
    width: 30%;
    background: #f5f5f5;
    font-size: 12px;
    padding: 8px;
    margin-right: 8px;
`;

const MarkerColor = styled(Box)<{ background: string }>`
    background: ${props => props.background};
    margin-right: 4px;
`;

const MarkerContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0px;
    padding: 0px;
    margin: 0px 2px;
    width: 90px;
`;
