import React from "react";
import TheaterIcon from "@mui/icons-material/PlayArrow";
import { connect } from "react-redux";
import { IconButton, Typography } from "@mui/material";
import { setTheaterModeAction } from "../../store/actions/base-actions";
import { State } from "../../store/types";
import { selectTheaterMode } from "../../store/reducers/base-reducer";
import { useTranslation } from "react-i18next";
import { sendAnalytics } from "../../utils/analytics";
import styled from "styled-components";

const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 10px;
    padding: 5px 10px;
    align-items: center;
`;

const mapStateToProps = (state: State) => ({
    theaterMode: selectTheaterMode(state),
});

const mapDispatchToProps = {
    setTheaterMode: setTheaterModeAction,
};

function TheaterMode({ theaterMode, setTheaterMode }: any) {
    const { t } = useTranslation();

    function setTheaterModeAndLog(value: boolean) {
        setTheaterMode(value);
        if (value) sendAnalytics({ type: "event", category: "menu", action: "animation" });
    }

    return (
        <Row>
            <Typography fontSize={"14px"}>{t("common.icons.animation")}</Typography>
            <IconButton title={t("common.icons.animation")} onClick={() => setTheaterModeAndLog(!theaterMode)}>
                <TheaterIcon color="primary" />
            </IconButton>
        </Row>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(TheaterMode);
