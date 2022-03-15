import * as React from "react";
import styled from "styled-components";
import { Box, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { useTranslation, Trans } from "react-i18next";
import { selectTheme } from "../../../../store/reducers/base-reducer";
import { State } from "../../../../store/types";
import * as R from "ramda";
import { setCountryModeAction, setRegionAction } from "../../../../store/actions/base-actions";
import { formatYears } from "../../../../utils/string-utils";
import { ZoomButton } from "../../../Chart";
import { TreatmentStudy } from "../../../../../domain/entities/TreatmentStudy";

const ChatContainer = styled.div`
    max-width: 500px;
    width: 100%;
`;

const Actions = styled.div`
    display: flex;
`;

const FlexGrow = styled.div`
    flex-grow: 1;
`;

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
});
const mapDispatchToProps = {
    setRegion: setRegionAction,
    setCountryMode: setCountryModeAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = {
    studies: TreatmentStudy[];
};
type Props = DispatchProps & StateProps & OwnProps;

const TreatmentFailureCountryChart = ({ studies, setRegion, setCountryMode }: Props) => {
    const { t } = useTranslation();
    const nStudies = studies.length;
    const sortedStudies = R.sortBy(study => parseInt(study.YEAR_START), studies);
    const maxYear = sortedStudies[sortedStudies.length - 1].YEAR_START;
    const minYear = sortedStudies[0].YEAR_START;
    const onClick = () => {
        setRegion({ country: studies[0].ISO2 });
        setCountryMode(false);
    };
    return (
        <ChatContainer>
            <Typography variant="subtitle1">
                <Box fontWeight="fontWeightBold">{`${t(
                    studies[0].ISO2 === "NA" ? "common.COUNTRY_NA" : studies[0].ISO2
                )}`}</Box>
            </Typography>
            <Typography variant="subtitle2">
                <Trans
                    i18nKey="common.treatment.chart.treatment_failure.content"
                    t={t}
                    values={{
                        nStudies: nStudies,
                        drug: t(sortedStudies[0].DRUG_NAME),
                        plasmodiumSpecies: t(sortedStudies[0].PLASMODIUM_SPECIES.replace(".", "%2E")),
                        years: formatYears(minYear, maxYear),
                    }}
                />
            </Typography>
            <Actions>
                <FlexGrow />
                <ZoomButton onClick={onClick} />
            </Actions>
        </ChatContainer>
    );
};
export default connect(mapStateToProps, mapDispatchToProps)(TreatmentFailureCountryChart);
