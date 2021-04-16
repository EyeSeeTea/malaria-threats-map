import * as React from "react";
import { Box, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectTheme } from "../../../../store/reducers/base-reducer";
import { State } from "../../../../store/types";
import * as R from "ramda";
import { setCountryModeAction, setRegionAction } from "../../../../store/actions/base-actions";
import { DiagnosisStudy } from "../../../../types/Diagnosis";
import { selectDiagnosisFilters } from "../../../../store/reducers/diagnosis-reducer";
import { formatList, formatYears } from "../../../../utils/string-utils";
import { Actions, ChartContainer, FlexGrow, ZoomButton } from "../../../Chart";

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    diagnosisFilters: selectDiagnosisFilters(state),
});
const mapDispatchToProps = {
    setRegion: setRegionAction,
    setCountryMode: setCountryModeAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = {
    studies: DiagnosisStudy[];
};
type Props = DispatchProps & StateProps & OwnProps;

const GeneDeletionCountryChart = ({ studies, setRegion, setCountryMode, diagnosisFilters }: Props) => {
    const { t } = useTranslation("common");
    const nStudies = studies.length;
    const sortedStudies = R.sortBy(study => parseInt(study.YEAR_START), studies);
    const sortedStudies2 = R.sortBy(study => parseInt(study.YEAR_END), studies);
    const maxYear = sortedStudies2[sortedStudies2.length - 1].YEAR_END;
    const minYear = sortedStudies[0].YEAR_START;
    const onClick = () => {
        setRegion({ country: studies[0].ISO2 });
        setCountryMode(false);
    };
    const surveyTypes = R.uniq(studies.map(study => study.SURVEY_TYPE)).map(type => t(type));
    return (
        <ChartContainer>
            <Typography variant="subtitle1">
                <Box fontWeight="fontWeightBold">{`${t(
                    studies[0].ISO2 === "NA" ? "COUNTRY_NA" : studies[0].ISO2
                )}`}</Box>
            </Typography>
            <Typography variant="subtitle2">
                {t(`diagnosis.chart.gene_deletions.content_1`, {
                    nStudies: nStudies,
                })}{" "}
                <i>P. falciparum</i>{" "}
                {t(`diagnosis.chart.gene_deletions.content_2`, {
                    deletionType: t(diagnosisFilters.deletionType).toLowerCase(),
                    surveyTypes: formatList(surveyTypes.map(st => t(st))),
                    years: formatYears(minYear, maxYear),
                })}
            </Typography>
            <Actions>
                <FlexGrow />
                <ZoomButton onClick={onClick} />
            </Actions>
        </ChartContainer>
    );
};
export default connect(mapStateToProps, mapDispatchToProps)(GeneDeletionCountryChart);
