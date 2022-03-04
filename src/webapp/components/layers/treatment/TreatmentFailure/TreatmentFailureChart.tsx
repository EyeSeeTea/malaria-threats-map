import * as React from "react";
import { useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import styled from "styled-components";
import { Box, Typography } from "@mui/material";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectTheme } from "../../../../store/reducers/base-reducer";
import { State } from "../../../../store/types";
import * as R from "ramda";
import Pagination from "../../../charts/Pagination";
import Citation from "../../../charts/Citation";
import { formatYears, formatYears2 } from "../../../../utils/string-utils";
import { PLASMODIUM_SPECIES_SUGGESTIONS } from "../../../filters/PlasmodiumSpeciesFilter";
import { TreatmentStudy } from "../../../../../domain/entities/TreatmentStudy";
import _ from "lodash";
import { isNotNull } from "../../../../utils/number-utils";
import Hidden from "../../../hidden/Hidden";

const options: (data: any, categories: any[], translations: any) => Highcharts.Options = (
    data,
    categories,
    translations
) => ({
    chart: {
        height: 250,
        width: 300,
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
    tooltip: {
        pointFormat: "{series.name}: <b>{point.y:.2f}%</b>",
        style: {
            width: 150,
        },
    },
    xAxis: { categories },
    yAxis: {
        min: 0,
        title: {
            text: translations.percentage,
        },
    },
    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                format: "{point.y}%",
            },
            label: {
                connectorAllowed: false,
            },
        },
    },
    series: data,
    legend: {
        itemStyle: {
            fontSize: "9px",
        },
        enabled: true,
        maxHeight: 70,
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

const Flex = styled.div`
    display: flex;
`;

const FlexCol = styled.div<{ flex?: number }>`
    flex: ${props => props.flex || 1};
`;

const Margin = styled.div`
    margin-top: 10px;
    margin-bottom: 10px;
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
    const [study, setStudy] = useState(0);
    const sortedStudies = R.sortBy(study => parseInt(study.YEAR_START), studies);
    const years = R.uniq(sortedStudies.map(study => study.YEAR_START)).sort();
    const maxYear = parseInt(sortedStudies[sortedStudies.length - 1].YEAR_START);
    const minYear = parseInt(sortedStudies[0].YEAR_START);

    const {
        YEAR_START,
        YEAR_END,
        PLASMODIUM_SPECIES,
        DRUG_NAME,
        N,
        FOLLOW_UP,
        CONFIRMED_RESIST_PV,
        POSITIVE_DAY_3,
        TREATMENT_FAILURE_KM,
        TREATMENT_FAILURE_PP,
        HEALTHFACILITY_NAME,
    } = sortedStudies[study];

    const keys = _([
        PLASMODIUM_SPECIES === "P._FALCIPARUM" ? { name: "POSITIVE_DAY_3", color: "#00994C" } : undefined,
        { name: "TREATMENT_FAILURE_PP", color: "#BE4B48" },
        { name: "TREATMENT_FAILURE_KM", color: "#4b48be" },
    ])
        .compact()
        .value();

    const series = keys.map(key => {
        return {
            name: t(`download.therapeutic_efficacy.${key.name}`),
            color: key.color,
            data: years.map(year => {
                const yearFilters: any = studies.filter(study => parseInt(year) === parseInt(study.YEAR_START))[0];
                return yearFilters ? parseFloat((parseFloat(yearFilters[key.name] || "0") * 100).toFixed(2)) : 0;
            }),
        };
    });

    const siteDuration = formatYears(`${minYear}`, `${maxYear}`);

    const titleItems = [
        studies[study].SITE_NAME,
        studies[study].PROVINCE,
        t(`countries.${studies[study].ISO2 === "NA" ? "common.COUNTRY_NA" : studies[study].ISO2}`),
    ];
    const title = titleItems.filter(Boolean).join(", ");

    const duration = formatYears2(YEAR_START, YEAR_END);
    const formatValue = (value: string) =>
        Number.isNaN(parseFloat(value)) ? "N/A" : `${(parseFloat(value) * 100).toFixed(1)}%`;

    const translations = {
        percentage: t("common.treatment.chart.treatment_failure.percentage"),
    };
    const healthFacilityName = t("common.treatment.chart.treatment_failure.health_facility_name");
    const studyYears = t("common.treatment.chart.treatment_failure.study_years");
    const numberOfPatients = t("common.treatment.chart.treatment_failure.number_of_patients");
    const followUp = t("common.treatment.chart.treatment_failure.follow_up");
    const confirmedResistPv = t("common.treatment.chart.treatment_failure.confirmed_resist_pv");
    const positiveDay3 = t("common.treatment.chart.treatment_failure.positive_day_3");
    const treatmentFailurePp = t("common.treatment.chart.treatment_failure.treatment_failure_pp");
    const treatmentFailureKm = t("common.treatment.chart.treatment_failure.treatment_failure_km");
    const days = t("common.treatment.chart.treatment_failure.days");
    const t_studies = t("common.treatment.chart.treatment_failure.studies");

    function renderInfo() {
        return (
            <Margin>
                {isNotNull(HEALTHFACILITY_NAME) && HEALTHFACILITY_NAME !== "Not applicable" && (
                    <Flex>
                        <Typography variant="body2">
                            <b>
                                {healthFacilityName}
                                :&nbsp;
                            </b>
                            {HEALTHFACILITY_NAME}
                        </Typography>
                    </Flex>
                )}
                <Flex>
                    <Typography variant="body2">
                        <b>
                            {studyYears}
                            :&nbsp;
                        </b>
                        {duration}
                    </Typography>
                </Flex>
                <Flex>
                    <Typography variant="body2">
                        <b>
                            {numberOfPatients}
                            :&nbsp;
                        </b>
                        {N}
                    </Typography>
                </Flex>
                <Flex>
                    <Typography variant="body2">
                        <b>
                            {followUp}
                            :&nbsp;
                        </b>
                        {FOLLOW_UP} {days}
                    </Typography>
                </Flex>
                {isNotNull(CONFIRMED_RESIST_PV) && (
                    <Flex>
                        <Typography variant="body2">
                            <b>
                                {confirmedResistPv}
                                :&nbsp;
                            </b>
                            {formatValue(CONFIRMED_RESIST_PV)}
                        </Typography>
                    </Flex>
                )}
                {isNotNull(POSITIVE_DAY_3) && PLASMODIUM_SPECIES === "P._FALCIPARUM" && (
                    <Flex>
                        <Typography variant="body2">
                            <b>
                                {positiveDay3}
                                :&nbsp;
                            </b>
                            {formatValue(POSITIVE_DAY_3)}
                        </Typography>
                    </Flex>
                )}
                {isNotNull(TREATMENT_FAILURE_PP) && (
                    <Flex>
                        <Typography variant="body2">
                            <b>
                                {treatmentFailurePp}
                                :&nbsp;
                            </b>
                            {formatValue(TREATMENT_FAILURE_PP)}
                        </Typography>
                    </Flex>
                )}
                {isNotNull(TREATMENT_FAILURE_KM) && (
                    <Flex>
                        <Typography variant="body2">
                            <b>
                                {treatmentFailureKm}
                                :&nbsp;
                            </b>
                            {formatValue(TREATMENT_FAILURE_KM)}
                        </Typography>
                    </Flex>
                )}
            </Margin>
        );
    }

    const plasmodiumSpecies = PLASMODIUM_SPECIES_SUGGESTIONS.find(
        (species: any) => species.value === PLASMODIUM_SPECIES
    ).label;

    return (
        <ChatContainer>
            <Pagination studies={studies} study={study} setStudy={setStudy} />
            <Typography variant="subtitle1">
                <Box fontWeight="fontWeightBold">{`${title}`}</Box>
            </Typography>
            <Typography variant="body2">
                <i>{plasmodiumSpecies}</i>
                {`, ${t(DRUG_NAME)}: ${studies.length} ${t_studies} ${siteDuration}`}
            </Typography>
            <Hidden smUp>
                {renderInfo()}
                <HighchartsReact highcharts={Highcharts} options={options(series, years, translations)} />
            </Hidden>
            <Hidden smDown>
                <Flex>
                    <FlexCol>{renderInfo()}</FlexCol>
                    <FlexCol>
                        <HighchartsReact highcharts={Highcharts} options={options(series, years, translations)} />
                    </FlexCol>
                </Flex>
            </Hidden>
            <Citation study={studies[study]} />
        </ChatContainer>
    );
};
export default connect(mapStateToProps)(TreatmentFailureChart);
