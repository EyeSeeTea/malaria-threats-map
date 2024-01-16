import React from "react";
import { Card, IconButton, Link, Typography, Box } from "@mui/material";
import { connect } from "react-redux";
import styled from "styled-components";
import CloseIcon from "@mui/icons-material/Close";
import CursorIcon from "./icons/CursorIcon";
import { sendAnalytics } from "../utils/analytics";
import { getAnalyticsPageView } from "../store/analytics";
import { setRegionAction } from "../store/actions/base-actions";
import { setToLocalStorage } from "../utils/browserCache";

const RoundedCard = styled(Card)`
    width: fit-content;
    padding: 12px 18px;
    border-radius: 12px;
    background: #f5f5f5;
`;

const Content = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 5px;
`;

const Circle = styled.div`
    border-radius: 100%;
    background: #ffffff;
    font-size: 0.75rem;
    max-height: 22px;
`;

const StyledLink = styled(Link)`
    color: #487299;
    cursor: pointer;
    &:hover {
        text-decoration: none;
    }
`;

const mapDispatchToProps = {
    setRegion: setRegionAction,
};

type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & {
    type: "greaterMekong" | "tour";
    text: string;
};

const InfoToastLink: React.FC<Props> = ({ setRegion, text, type }) => {
    const [visible, setVisible] = React.useState(true);

    const handleClose = React.useCallback(() => setVisible(false), []);
    const handleClick = React.useCallback(() => {
        if (type === "greaterMekong") {
            sendAnalytics({ type: "event", category: "homeItem", action: "mekong" });
            const pageView = getAnalyticsPageView({ page: "treatment" });
            sendAnalytics({ type: "pageView", path: pageView.path });
            setRegion({
                subRegion: "GREATER_MEKONG",
            });
        } else {
            sendAnalytics({ type: "event", category: "menu", action: "menuTour" });
            setToLocalStorage("tour", "");
            window.history.pushState({}, document.title, window.location.href.split("?")[0]);
            window.location.reload();
        }
    }, [setRegion, type]);

    return visible ? (
        <RoundedCard>
            <Content>
                <Box display={"flex"} width="100%" justifyContent={"center"}>
                    <StyledLink onClick={handleClick}>
                        <Typography variant="body2">{text}</Typography>
                    </StyledLink>
                    <CursorIcon />
                </Box>
                <Circle>
                    <IconButton onClick={handleClose} size="small" sx={{ padding: 0.5 }}>
                        <CloseIcon sx={{ fontSize: 13 }} />
                    </IconButton>
                </Circle>
            </Content>
        </RoundedCard>
    ) : null;
};

export default connect(null, mapDispatchToProps)(InfoToastLink);
