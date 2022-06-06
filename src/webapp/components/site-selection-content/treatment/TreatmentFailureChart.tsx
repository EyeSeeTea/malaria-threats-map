import * as React from "react";
import { useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import styled from "styled-components";
import { Typography } from "@mui/material";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectTheme } from "../../../store/reducers/base-reducer";
import { State } from "../../../store/types";
import * as R from "ramda";
import { PLASMODIUM_SPECIES_SUGGESTIONS } from "../../filters/PlasmodiumSpeciesFilter";
import { TreatmentStudy } from "../../../../domain/entities/TreatmentStudy";
import _ from "lodash";

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
            fontSize: "9px",
        },
        enabled: true,
        itemMarginTop: 12,
    },
    credits: {
        enabled: false,
    },
});

const ChatContainer = styled.div`
    max-width: 600px;
    width: 100%;
    @media all and (-ms-high-contrast: none) {
        & {
            width: 600px;
        }
    }
`;

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;
type OwnProps = {
    studies: TreatmentStudy[];
};
type Props = StateProps & OwnProps;

const TreatmentFailureChart = ({ studies }: Props) => {
    const { t } = useTranslation();
    const sortedStudies = R.sortBy(study => parseInt(study.YEAR_START), studies);
    const years = R.uniq(sortedStudies.map(study => study.YEAR_START)).sort();

    const { PLASMODIUM_SPECIES, DRUG_NAME } = sortedStudies[0];

    const keys = _([
        {
            name: "treatment_failure_pp",
            color: "#940D12",
            marker: {
                symbol: "circle",
            },
        },
        {
            name: "treatment_failure_km",
            color: "#C0575B",
            marker: {
                symbol: "diamond",
            },
        },
        PLASMODIUM_SPECIES === "P._FALCIPARUM"
            ? {
                  name: "positive_day_3",
                  color: "#FCCFA6",
                  marker: {
                      symbol: "square",
                  },
              }
            : undefined,
    ])
        .compact()
        .value();

    const series = keys.map(key => {
        return {
            name: t(`common.treatment.chart.treatment_failure.${key.name}`),
            color: key.color,
            lineWidth: 0,
            marker: key.marker,
            data: years.map(year => {
                const yearFilters: any = studies.filter(study => parseInt(year) === parseInt(study.YEAR_START))[0];
                return yearFilters ? parseFloat((parseFloat(yearFilters[key.name] || "0") * 100).toFixed(2)) : 0;
            }),
        };
    });

    const translations = {
        percentage: t("common.treatment.chart.treatment_failure.percentage"),
    };

    const plasmodiumSpecies = PLASMODIUM_SPECIES_SUGGESTIONS.find(
        (species: any) => species.value === PLASMODIUM_SPECIES
    ).label;

    return (
        <React.Fragment>
            <Typography variant="body2">
                <i>{plasmodiumSpecies}</i>
                {`, ${t(DRUG_NAME)}`}
            </Typography>
            <HighchartsReact highcharts={Highcharts} options={options(series, years, translations)} />
        </React.Fragment>
    );
};
export default connect(mapStateToProps)(TreatmentFailureChart);
