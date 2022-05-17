import React from "react";
import { Card, IconButton, Link, Typography } from "@mui/material";
import { connect } from "react-redux";
import styled from "styled-components";
import CloseIcon from "@mui/icons-material/Close";
import CursorIcon from "../icons/CursorIcon";
import { useTranslation } from "react-i18next";
import { sendAnalytics } from "../../utils/analytics";
import { getAnalyticsPageView } from "../../store/analytics";
import { setRegionAction } from "../../store/actions/base-actions";

const RoundedCard = styled(Card)`
    padding: 12px;
    border-radius: 12px;
    background: #f5f5f5;
`;

const Content = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const Circle = styled.div`
    border-radius: 100%;
    background: #ffffff;
    font-size: 0.75rem;
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
type Props = DispatchProps;

const GreaterMekongLink: React.FC<Props> = ({ setRegion }) => {
    const [visible, setVisible] = React.useState(true);
    const { t } = useTranslation();

    const handleClose = React.useCallback(() => setVisible(false), []);
    const handleClick = React.useCallback(() => {
        sendAnalytics({ type: "event", category: "homeItem", action: "mekong" });
        const pageView = getAnalyticsPageView({ page: "treatment" });
        sendAnalytics({ type: "pageView", path: pageView.path });
        setRegion({
            subRegion: "GREATER_MEKONG",
        });
    }, [setRegion]);

    return visible ? (
        <RoundedCard>
            <Content>
                <StyledLink onClick={handleClick}>
                    <Typography variant="body2">{t("common.mekong_link")}</Typography>
                </StyledLink>

                <CursorIcon />
                <Circle>
                    <IconButton onClick={handleClose} size="small" sx={{ padding: 0.5 }}>
                        <CloseIcon sx={{ fontSize: 13 }} />
                    </IconButton>
                </Circle>
            </Content>
        </RoundedCard>
    ) : null;
};

export default connect(null, mapDispatchToProps)(GreaterMekongLink);
