import * as React from "react";
import { useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import styled from "styled-components";
import { Box, Typography, Button } from "@mui/material";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectTheme, selectSelection, selectViewData } from "../../../../store/reducers/base-reducer";
import { State } from "../../../../store/types";
import * as R from "ramda";
import Citation from "../../../charts/Citation";
import { formatYears } from "../../../../utils/string-utils";
import { PLASMODIUM_SPECIES_SUGGESTIONS } from "../../../filters/PlasmodiumSpeciesFilter";
import { TreatmentStudy } from "../../../../../domain/entities/TreatmentStudy";
import _ from "lodash";
import { isNotNull } from "../../../../utils/number-utils";
import { ChartContainer } from "../../../Chart";
import ViewSummaryDataButton from "../../../ViewSummaryDataButton";

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

const Flex = styled.div`
    display: flex;
`;

const Margin = styled.div`
    margin-top: 10px;
    margin-bottom: 10px;
`;

const FlexCol = styled.div<{ flex?: number }>`
    flex: ${props => props.flex || 1};
`;

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    selection: selectSelection(state),
    viewData: selectViewData(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;
type OwnProps = {
    studies: TreatmentStudy[];
    popup?: boolean;
};
type Props = StateProps & OwnProps;

const TreatmentFailureChart = ({ studies, selection, viewData, popup }: Props) => {
    const { t } = useTranslation();
    const [study, setStudy] = useState(0);
    const [showMore, setShowMore] = useState(false);
    const sortedStudies = R.sortBy(study => parseInt(study.YEAR_START), studies);
    const years = R.uniq(sortedStudies.map(study => study.YEAR_START)).sort();
    const maxYear = parseInt(sortedStudies[sortedStudies.length - 1].YEAR_START);
    const minYear = parseInt(sortedStudies[0].YEAR_START);

    const { PLASMODIUM_SPECIES, DRUG_NAME } = sortedStudies[study];

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

    const StyledButton = styled(Button)`
        &.MuiButton-text {
            text-transform: none;
            color: #2fb3af;
        }
        &.MuiButton-root {
            padding: 0;

            &:hover {
                border: none;
                text-decoration: underline;
            }
        }
    `;

    const siteDuration = formatYears(`${minYear}`, `${maxYear}`);

    const titleItems = [
        studies[study].SITE_NAME,
        studies[study].PROVINCE,
        t(`countries.${studies[study].ISO2 === "NA" ? "common.COUNTRY_NA" : studies[study].ISO2}`),
    ];
    const title = titleItems.filter(Boolean).join(", ");

    const translations = {
        percentage: t("common.treatment.chart.treatment_failure.percentage"),
    };

    const t_studies = t("common.treatment.chart.treatment_failure.studies");

    const plasmodiumSpecies = PLASMODIUM_SPECIES_SUGGESTIONS.find(
        (species: any) => species.value === PLASMODIUM_SPECIES
    ).label;

    return (
        <ChartContainer popup={popup}>
            <Typography variant="subtitle1">
                <Box fontWeight="fontWeightBold">{`${title}`}</Box>
            </Typography>
            <Typography variant="body2">
                <i>{plasmodiumSpecies}</i>
                {`, ${t(DRUG_NAME)}: ${studies.length} ${t_studies} ${siteDuration}`}
            </Typography>
            {selection !== null && popup && <ViewSummaryDataButton />}
            {viewData !== null && !popup && (
            <> 
            <HighchartsReact highcharts={Highcharts} options={options(series, years, translations)} />
            <Margin>
                <Flex style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Typography variant="body2">
                        {t("common.treatment.chart.treatment_failure.additional_information")}
                    </Typography>
                    <StyledButton onClick={() => setShowMore(prev => !prev)}>
                        {t(`common.treatment.chart.treatment_failure.${showMore ? "show_less" : "show_more"}`)}
                    </StyledButton>
                </Flex>
            </Margin></>)}
            {showMore && (
                <Margin>
                    {sortedStudies.map((study, index) => (
                        <Margin key={index}>
                            <Flex>
                                <FlexCol>
                                    <Typography variant="body2" fontWeight="fontWeightBold">
                                        {study.YEAR_START}
                                    </Typography>
                                </FlexCol>
                                <FlexCol>
                                    <Typography variant="body2">
                                        {isNotNull(study.HEALTHFACILITY_NAME) &&
                                            study.HEALTHFACILITY_NAME !== "Not applicable" && (
                                                <>
                                                    {t("common.treatment.chart.treatment_failure.addit_info_1", {
                                                        healthFacility: study.HEALTHFACILITY_NAME,
                                                    })}{" "}
                                                </>
                                            )}
                                        {t("common.treatment.chart.treatment_failure.addit_info_2", {
                                            nPatients: study.N,
                                            followUp: study.FOLLOW_UP,
                                        })}
                                    </Typography>
                                    <Citation study={study} />
                                </FlexCol>
                            </Flex>
                        </Margin>
                    ))}
                </Margin>
            )}
            
        </ChartContainer>
    );
};
export default connect(mapStateToProps)(TreatmentFailureChart);
