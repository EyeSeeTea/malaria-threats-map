import React from "react";
import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import withStyles from "@mui/styles/withStyles";
import { Button, Card, CardContent, Typography } from "@mui/material";
import styled from "styled-components";
import { setRegionAction, setThemeAction } from "../store/actions/base-actions";
import { connect } from "react-redux";
import { colors } from "../constants/theme";
import { sendAnalytics } from "../utils/analytics";
import { getAnalyticsPageView } from "../store/analytics";
import { useTranslation } from "react-i18next";

const ColorButton = withStyles((_theme: Theme) => ({
    root: {
        color: "white",
        backgroundColor: colors.treatment.N,
        "&:hover": {
            backgroundColor: colors.treatment.D1,
        },
    },
}))(Button);

const useStyles = makeStyles({
    card: {
        margin: 8,
        maxWidth: 300,
        textAlign: "center",
        justifyContent: "flex-start",
        flexDirection: "column",
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
    },
    bullet: {
        display: "inline-block",
        margin: "0 2px",
        transform: "scale(0.8)",
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
        width: "100%",
    },
    desc: {
        width: "100%",
    },
});

// Fix for IE11
const StyledCardContent = styled(CardContent)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    width: calc(100% - 1px);
`;

const mapDispatchToProps = {
    setTheme: setThemeAction,
    setRegion: setRegionAction,
};

const ButtonWrapper = styled.div`
    margin-top: 16px;
`;

type OwnProp = {
    title?: string;
    description?: string;
    theme?: string;
    onSelection?: () => void;
    Icon?: any;
    hasFooter?: boolean;
};

type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & OwnProp;

const SimpleCard = ({ title, description, Icon, theme, setTheme, setRegion, onSelection, hasFooter }: Props) => {
    const classes = useStyles({});
    const { t } = useTranslation();

    return (
        <Card
            className={classes.card}
            onClick={() => {
                onSelection();
                setTheme(theme, { fromHome: true });
            }}
        >
            <Icon selected style={{ maxWidth: "96px", marginTop: "24px" }} />
            <StyledCardContent>
                <Typography className={classes.pos} variant="h6" component="h2">
                    {title}
                </Typography>
                <Typography className={classes.desc} variant="body2" component="p">
                    {description}
                </Typography>
                {hasFooter && (
                    <ButtonWrapper>
                        <ColorButton
                            variant="contained"
                            size="large"
                            onClick={ev => {
                                sendAnalytics({ type: "event", category: "homeItem", action: "mekong" });
                                const pageView = getAnalyticsPageView({ page: "treatment" });
                                sendAnalytics({ type: "pageView", path: pageView.path });

                                setTheme("treatment", { fromHome: true });
                                setRegion({
                                    subRegion: "GREATER_MEKONG",
                                });
                                onSelection();
                                ev.stopPropagation();
                            }}
                        >
                            {t("common.themes.mekong")}
                        </ColorButton>
                    </ButtonWrapper>
                )}
            </StyledCardContent>
        </Card>
    );
};

export default connect(null, mapDispatchToProps)(SimpleCard);
