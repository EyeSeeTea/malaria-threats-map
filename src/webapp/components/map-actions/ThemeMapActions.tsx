import React, { useMemo } from "react";

import { connect } from "react-redux";
import ActionGroupItem from "./ActionGroupItem";
import styled from "styled-components";
import TopicSelector from "../TopicSelector";
import { useTranslation } from "react-i18next";
import { selectTheme } from "../../store/reducers/base-reducer";
import { State } from "../../store/types";
import { DiagnosisIcon, InvasiveIcon, PreventionIcon, TreatmentIcon } from "../Icons";
import { Box } from "@mui/material";
import { GridSize } from "@mui/material";
import { Source } from "../../store/actions/base-actions";

const Label = styled.span`
    font-weight: bold;
`;

const Value = styled.span`
    font-weight: normal;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    margin: 0px;
    padding: 0px;
`;

interface ownProps {
    themeItemGridSize?: GridSize;
    from: Source;
}

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;
type Props = StateProps & ownProps;

const ThemeMapActions: React.FC<Props> = ({ theme, themeItemGridSize, from }) => {
    const { t } = useTranslation();

    const themeValue = useMemo(() => {
        switch (theme) {
            case "prevention": {
                return (
                    <Row>
                        <Label>{t("mapActions.theme")}:&nbsp;</Label>
                        <PreventionIcon selected size={30} />
                        <Value>{t("common.themes.prevention")}</Value>
                    </Row>
                );
            }
            case "diagnosis": {
                return (
                    <Row>
                        <Label>{t("mapActions.theme")}:&nbsp;</Label>
                        <DiagnosisIcon selected size={30} />
                        <Value>{t("common.themes.diagnosis")}</Value>
                    </Row>
                );
            }
            case "invasive": {
                return (
                    <Row>
                        <Label>{t("mapActions.theme")}:&nbsp;</Label>
                        <InvasiveIcon selected size={30} />
                        <Value>{t("common.themes.invasive")}</Value>
                    </Row>
                );
            }
            case "treatment": {
                return (
                    <Row>
                        <Label>{t("mapActions.theme")}:&nbsp;</Label>
                        <TreatmentIcon selected size={30} />
                        <Value>{t("common.themes.treatment")}</Value>
                    </Row>
                );
            }
        }

        return;
    }, [theme, t]);

    return (
        <Box id="theme">
            <ActionGroupItem placeholder={t("mapActions.selectTheme")} actionGroupKey={"THEME"} value={themeValue}>
                <TopicSelector themeItemGridSize={themeItemGridSize} from={from} />
            </ActionGroupItem>
        </Box>
    );
};

export default connect(mapStateToProps)(ThemeMapActions);
