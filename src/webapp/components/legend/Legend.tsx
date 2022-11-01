import React from "react";

import { State } from "../../store/types";
import { connect } from "react-redux";
import { selectFilters, selectTheme } from "../../store/reducers/base-reducer";
import { selectPreventionFilters } from "../../store/reducers/prevention-reducer";
import { setPreventionMapType } from "../../store/actions/prevention-actions";
import { selectDiagnosisFilters } from "../../store/reducers/diagnosis-reducer";
import { selectTreatmentFilters } from "../../store/reducers/treatment-reducer";
import { selectInvasiveFilters } from "../../store/reducers/invasive-reducer";
import { getLegendLabels, getLegendMapTypeHelpKey, getLegendTitle } from "./utils";
import LegendContent, { LegendLabel } from "./LegendContent";
import { selectTranslations } from "../../store/reducers/translations-reducer";
import styled from "styled-components";
import { Button, Collapse, Divider, Stack, Typography } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Trans, useTranslation } from "react-i18next";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const StyledButton = styled(Button)`
    color: black;
    padding: 15px 20px;
    text-transform: none;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const Title = styled.span`
    text-align: start;
    flex-grow: 1;
    font-weight: bold;
    line-height: 18px;
`;
const Subtitle = styled(Typography)`
    text-align: start;
    flex-grow: 1;
    color: grey;
    font-weight: normal;
    font-size: 11px;
    margin-top: 4px;
`;

const Footer = styled.span`
    color: grey;
    font-size: 11px;
`;

const Question = styled.div`
    margin-top: 8px;
    font-size: 11px;
    display: flex;
    flex-direction: row;
`;

const HelpContainer = styled(Stack)`
    font-size: 12px;
`;

const TitleContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const Body = styled.div`
    padding: 20px;
`;

const mapStateToProps = (state: State) => ({
    filters: selectFilters(state),
    theme: selectTheme(state),
    preventionFilters: selectPreventionFilters(state),
    diagnosisFilters: selectDiagnosisFilters(state),
    treatmentFilters: selectTreatmentFilters(state),
    invasiveFilters: selectInvasiveFilters(state),
    translations: selectTranslations(state),
});

const mapDispatchToProps = {
    setPreventionMapType: setPreventionMapType,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const Legend: React.FC<Props> = ({
    theme,
    preventionFilters,
    diagnosisFilters,
    treatmentFilters,
    invasiveFilters,
    translations,
}) => {
    const [expanded, setExpanded] = React.useState<boolean>(false);
    const [title, setTitle] = React.useState<string>("");
    const [labels, setLabels] = React.useState<LegendLabel[]>([]);
    const [mapTypeHelpKey, setMapTypeHelpKey] = React.useState<string>("");

    const { t } = useTranslation();

    const handleExpand = React.useCallback(() => {
        setExpanded(!expanded);
    }, [expanded]);

    React.useEffect(() => {
        if (!translations) return;

        return setTitle(getLegendTitle(theme, preventionFilters, diagnosisFilters, treatmentFilters, invasiveFilters));
    }, [theme, preventionFilters, diagnosisFilters, treatmentFilters, invasiveFilters, translations]);

    React.useEffect(() => {
        return setMapTypeHelpKey(
            getLegendMapTypeHelpKey(theme, preventionFilters, diagnosisFilters, treatmentFilters, invasiveFilters)
        );
    }, [theme, preventionFilters, diagnosisFilters, treatmentFilters, invasiveFilters]);

    React.useEffect(
        () => setLabels(getLegendLabels(theme, preventionFilters, diagnosisFilters, treatmentFilters, invasiveFilters)),
        [theme, preventionFilters, diagnosisFilters, treatmentFilters, invasiveFilters]
    );

    return (
        <React.Fragment>
            <StyledButton fullWidth={true} onClick={handleExpand}>
                <TitleContainer>
                    <Title>
                        {title.split("\n").map(str => (
                            <div key={str}>{str}</div>
                        ))}
                    </Title>
                    {!expanded && <Subtitle>{t("common.legend.subtitle")}</Subtitle>}
                </TitleContainer>
                {expanded ? <ExpandLess /> : <ExpandMore />}
            </StyledButton>

            <Divider />
            <Body>
                <LegendContent labels={labels} />
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <Stack gap={1} marginTop="10px">
                        <HelpContainer gap={1}>
                            <Typography variant="caption" sx={{ overflowWrap: "break-word" }}>
                                <Trans i18nKey={`${mapTypeHelpKey}.p1`} t={t}>
                                    This map contains data from <strong>intensity concentration bioassays</strong>. Each
                                    dot on the map represents a study site containing one or more studies. In sites
                                    where studies show varying levels of resistance intensity, the colour of the dot is
                                    determined by the most recent results.{" "}
                                    <a href="/">WHO manual for resistance monitoring</a>.
                                </Trans>
                            </Typography>
                            <Typography variant="caption">
                                <Trans i18nKey={`${mapTypeHelpKey}.p2`} t={t}>
                                    For information on how each level is defined, please consult the&nbsp;
                                    <a href="/">WHO manual for resistance monitoring</a>.
                                </Trans>
                            </Typography>
                        </HelpContainer>
                        <Footer>
                            <Subtitle fontStyle={"italic"}>{t(`${mapTypeHelpKey}.footer`)}</Subtitle>
                        </Footer>
                        {(theme === "invasive" || theme === "diagnosis") && (
                            <Question>
                                <ErrorOutlineIcon sx={{ color: "#2fb3af" }} />
                                <span style={{ marginLeft: "6px" }}>
                                    <Trans i18nKey={`${mapTypeHelpKey}.question`} t={t}>
                                        Please report the detection of invasive Anopheles vector species using this{" "}
                                        <a href="/">reporting form</a>.
                                    </Trans>
                                </span>
                            </Question>
                        )}
                    </Stack>
                </Collapse>
            </Body>
        </React.Fragment>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Legend);
