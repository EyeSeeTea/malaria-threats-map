import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { Box, Typography, Button } from "@mui/material";
import { connect } from "react-redux";
import { selectTheme } from "../../../../store/reducers/base-reducer";
import { State } from "../../../../store/types";
import * as R from "ramda";
import Citation from "../../../charts/Citation";
import { lowerCase } from "lower-case";
import Pagination from "../../../charts/Pagination";
import { useTranslation } from "react-i18next";
import { ChartContainer } from "../../../Chart";
import Curation from "../../../Curation";
import { isNotNull } from "../../../../utils/number-utils";
import { InvasiveStudy } from "../../../../../domain/entities/InvasiveStudy";
const Flex = styled.div`
    display: flex;
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
    studies: InvasiveStudy[];
};
type Props = StateProps & OwnProps;

const VectorOccurrenceChart = ({ studies }: Props) => {
    const { t } = useTranslation();
    const translations = [
        t("utils.Jan."),
        t("utils.Feb."),
        t("utils.Mar."),
        t("utils.Apr."),
        t("utils.May"),
        t("utils.June"),
        t("utils.July"),
        t("utils.Aug."),
        t("utils.Sept."),
        t("utils.Oct."),
        t("utils.Nov."),
        t("utils.Dec."),
    ];
    const getMonthFromNumber = (month: number) => translations[month - 1];

    const [study, setStudy] = useState(0);
    const sortedStudies = R.sortBy(study => -parseInt(study.YEAR_START), studies);

    const studyObject = sortedStudies[study];

    const monthStart = getMonthFromNumber(parseInt(studyObject.MONTH_START));
    const monthEnd = getMonthFromNumber(parseInt(studyObject.MONTH_END));
    const yearStart = parseInt(studyObject.YEAR_START);
    const yearEnd = parseInt(studyObject.YEAR_END);

    const start = monthStart ? `${monthStart}, ${yearStart}` : `${yearStart}`;
    const end = monthEnd ? `${monthEnd}, ${yearEnd}` : `${yearEnd}`;

    const unique = yearStart === yearEnd && monthStart === monthEnd;
    const partial = (() => {
        if (!Number.isNaN(yearStart) && !Number.isNaN(yearEnd)) {
            return `${start} to ${end}`;
        } else if (!Number.isNaN(yearStart) && Number.isNaN(yearEnd)) {
            return start;
        } else if (Number.isNaN(yearStart) && !Number.isNaN(yearEnd)) {
            return end;
        }
    })();

    const duration = (unique ? start : partial) || "";

    const samplingPeriod = t("common.invasive.chart.vector_occurrance.sampling_period");
    const samplingMethod = t("common.invasive.chart.vector_occurrance.sampling_method");
    const studyIdentificationMethod = t("common.invasive.chart.vector_occurrance.study_identification_method");

    return (
        <ChartContainer>
            {sortedStudies.length > 1 && <Pagination studies={studies} study={study} setStudy={setStudy} />}
            <Typography variant="subtitle1">
                <Box fontWeight="fontWeightBold">{`${studyObject.VILLAGE_NAME}`}</Box>
            </Typography>
            <Margin>
                {(isNotNull(studyObject.VECTOR_SPECIES) || isNotNull(studyObject.VECTOR_SPECIES_COMPLEX)) && (
                    <Flex>
                        <Typography variant="body2">
                            <b>{t("common.invasive.chart.vector_occurrance.species")}:&nbsp;</b>
                            {isNotNull(studyObject.VECTOR_SPECIES)
                                ? studyObject.VECTOR_SPECIES
                                : isNotNull(studyObject.VECTOR_SPECIES_COMPLEX)
                                ? studyObject.VECTOR_SPECIES_COMPLEX
                                : ""}
                        </Typography>
                    </Flex>
                )}
                {duration && (
                    <Flex>
                        <Typography variant="body2">
                            <b>{samplingPeriod}:&nbsp;</b>
                            {duration}
                        </Typography>
                    </Flex>
                )}
                <Flex>
                    <Typography variant="body2">
                        <b>{samplingMethod}:&nbsp;</b>
                        {studyObject.SAMPLING_METHOD || t("common.invasive.chart.vector_occurrance.no_available")}
                    </Typography>
                </Flex>
                <Flex>
                    <Typography variant="body2">
                        <b>{studyIdentificationMethod}:&nbsp;</b>
                        {studyObject.ID_METHOD
                            ? lowerCase(studyObject.ID_METHOD)
                            : t("common.invasive.chart.vector_occurrance.no_available")}
                    </Typography>
                </Flex>
            </Margin>
            <Margin>
                <Citation study={studyObject} />
            </Margin>
            <Curation study={studyObject} />
        </ChartContainer>
    );
};
export default connect(mapStateToProps)(VectorOccurrenceChart);
