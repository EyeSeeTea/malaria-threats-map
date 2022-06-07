import * as React from "react";
import { useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import styled from "styled-components";
import { Box, Typography } from "@mui/material";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectTheme } from "../../../store/reducers/base-reducer";
import { State } from "../../../store/types";
import * as R from "ramda";
import { MutationColors } from "../../layers/treatment/MolecularMarkers/utils";
import Pagination from "../../charts/Pagination";
import { MOLECULAR_MARKERS } from "../../filters/MolecularMarkerFilter";
import { selectTreatmentFilters } from "../../../store/reducers/treatment-reducer";
import Citation from "../../charts/Citation";
import { TreatmentStudy } from "../../../../domain/entities/TreatmentStudy";

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

const exists = (value: string) => {
    if (!value) {
        return false;
    }
    const trimmed = value.trim();
    return trimmed !== "N/A" && trimmed !== "NA" && trimmed !== null;
};

const ChatContainer = styled.div`
    max-width: 500px;
    width: 100%;
`;

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    treatmentFilters: selectTreatmentFilters(state),
});
const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = {
    studies: TreatmentStudy[];
};
type Props = DispatchProps & StateProps & OwnProps;

const MolecularMarkersChart = ({ studies, treatmentFilters }: Props) => {
    console.log(studies);
    const { t } = useTranslation();
    const [studyIndex, setStudy] = useState(0);
    const sortedStudies = R.sortBy(study => -parseInt(study.YEAR_START), studies);
    const years = sortedStudies.map(study => parseInt(study.YEAR_START)).sort();
    const minYear = parseInt(sortedStudies[sortedStudies.length - 1].YEAR_START);
    const maxYear = parseInt(sortedStudies[0].YEAR_START);
    const groupStudies = R.flatten(sortedStudies.map(study => study.groupStudies));
    const k13Groups = R.groupBy(R.prop("GENOTYPE"), groupStudies);
    const series = Object.keys(k13Groups).map((genotype: string) => {
        const studies: TreatmentStudy[] = k13Groups[genotype];
        return {
            maxPointWidth: 20,
            name: genotype,
            color: MutationColors[genotype] ? MutationColors[genotype].color : "000",
            data: R.reverse(sortedStudies).map(k13Study => {
                const study = studies.find(study => k13Study.Code === study.K13_CODE);
                return {
                    y: study ? parseFloat((study.PROPORTION * 100).toFixed(1)) : undefined,
                };
            }),
        };
    });

    const titleItems = [
        studies[studyIndex].SITE_NAME,
        studies[studyIndex].PROVINCE,
        t(studies[studyIndex].ISO2 === "NA" ? "common.COUNTRY_NA" : studies[studyIndex].ISO2),
    ];
    const title = titleItems.filter(Boolean).join(", ");
    const molecularMarker = t(MOLECULAR_MARKERS.find((m: any) => m.value === treatmentFilters.molecularMarker).label);
    const study = sortedStudies[sortedStudies.length - studyIndex - 1];
    const translations = {
        percentage: t("common.treatment.chart.molecular_markers.percentage"),
    };

    return (
        <ChatContainer>
            <Pagination studies={studies} study={studyIndex} setStudy={setStudy} />
            <Typography variant="subtitle1">
                <Box fontWeight="fontWeightBold">{`${title} (${minYear}-${maxYear})`}</Box>
            </Typography>

            <Typography variant="body2">
                {t("common.treatment.chart.molecular_markers.subtitle", {
                    molecularMarker,
                })}
            </Typography>
            <HighchartsReact highcharts={Highcharts} options={options(series, years, translations)} />

            <Citation study={study} />
        </ChatContainer>
    );
};
export default connect(mapStateToProps, mapDispatchToProps)(MolecularMarkersChart);
