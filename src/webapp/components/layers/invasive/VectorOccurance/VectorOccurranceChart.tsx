import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { Box, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { selectTheme } from "../../../../store/reducers/base-reducer";
import { State } from "../../../../store/types";
import * as R from "ramda";
import Citation from "../../../charts/Citation";
import { getMonthFromNumber } from "./utils";
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
const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = {
    studies: InvasiveStudy[];
};
type Props = DispatchProps & StateProps & OwnProps;

const VectorOccurrenceChart = ({ studies }: Props) => {
    const { t } = useTranslation("common");
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

    const samplingPeriod = t("invasive.chart.vector_occurrance.sampling_period");
    const samplingMethod = t("invasive.chart.vector_occurrance.sampling_method");
    const studyIdentificationMethod = t("invasive.chart.vector_occurrance.study_identification_method");

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
                            <b>{t("invasive.chart.vector_occurrance.species")}:&nbsp;</b>
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
                        {studyObject.SAMPLING_METHOD || t("invasive.chart.vector_occurrance.no_available")}
                    </Typography>
                </Flex>
                <Flex>
                    <Typography variant="body2">
                        <b>{studyIdentificationMethod}:&nbsp;</b>
                        {studyObject.ID_METHOD
                            ? lowerCase(studyObject.ID_METHOD)
                            : t("invasive.chart.vector_occurrance.no_available")}
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
export default connect(mapStateToProps, mapDispatchToProps)(VectorOccurrenceChart);
