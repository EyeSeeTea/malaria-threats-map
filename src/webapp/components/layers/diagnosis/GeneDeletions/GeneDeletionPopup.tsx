import * as React from "react";
import styled from "styled-components";
import { Box, Typography } from "@mui/material";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import * as R from "ramda";
import { selectTheme } from "../../../../store/reducers/base-reducer";
import { State } from "../../../../store/types";
import { formatList, formatYears } from "../../../../utils/string-utils";
import { selectDiagnosisFilters } from "../../../../store/reducers/diagnosis-reducer";
import { DiagnosisStudy } from "../../../../../domain/entities/DiagnosisStudy";
import ViewSummaryDataButton from "../../../ViewSummaryDataButton";

const ChatContainer = styled.div`
    max-width: 500px;
    width: 100%;
    border-radius: 10px;
`;

const SpacedTypography = styled(Typography)`
    margin-bottom: 5px;
`;

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    diagnosisFilters: selectDiagnosisFilters(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;
type OwnProps = {
    studies: DiagnosisStudy[];
};
type Props = StateProps & OwnProps;

const GeneDeletionPopup = ({ studies, diagnosisFilters }: Props) => {
    const { t } = useTranslation();
    const nStudies = studies.length;
    const sortedStudies = R.sortBy(study => parseInt(study.YEAR_START), studies);
    const sortedStudies2 = R.sortBy(study => parseInt(study.YEAR_END), studies);
    const maxYear = sortedStudies2[sortedStudies2.length - 1].YEAR_END;
    const minYear = sortedStudies[0].YEAR_START;
    const studyObject = studies[0];
    const surveyTypes = R.uniq(studies.map(study => study.SURVEY_TYPE)).map(type => t(type));

    return (
        <ChatContainer>
            <Typography variant="subtitle1">
                <Box fontWeight="fontWeightBold">
                    {t(studyObject.ISO2 === "NA" ? "common.COUNTRY_NA" : studyObject.ISO2)}
                </Box>
            </Typography>
            <SpacedTypography variant="subtitle2">
                {t("common.diagnosis.chart.gene_deletions.content_1", {
                    nStudies,
                })}
                <i>{t(diagnosisFilters.deletionType).toLowerCase()}</i>
                {t("common.diagnosis.chart.gene_deletions.content_2", {
                    surveyTypes: formatList(
                        surveyTypes.map(st => {
                            const dhs = t("common.diagnosis.chart.gene_deletions.DHS");
                            return st.toLowerCase().replace(new RegExp(dhs, "i"), dhs);
                        })
                    ),
                    years: formatYears(minYear, maxYear),
                })}
            </SpacedTypography>
            <ViewSummaryDataButton />
        </ChatContainer>
    );
};
export default connect(mapStateToProps)(GeneDeletionPopup);
