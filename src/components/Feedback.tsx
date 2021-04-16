import React, { useEffect, useRef } from "react";
import Dialog from "@material-ui/core/Dialog";
import { Button, createStyles, Fab, makeStyles, Theme } from "@material-ui/core";
import FeedbackIcon from "@material-ui/icons/RateReview";
import { State } from "../store/types";
import { setFeedbackOpenAction } from "../store/actions/base-actions";
import { selectIsFeedbackOpen } from "../store/reducers/base-reducer";
import { connect } from "react-redux";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { sendAnalytics } from "../utils/analytics";
import { Flex, FlexGrow } from "./Chart";
import styled from "styled-components";

const ButtonWrapper = styled(Flex)`
    margin-bottom: 16px;
`;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginTop: theme.spacing(1),
            "& > *": {
                margin: theme.spacing(1),
                width: "25ch",
            },
        },
        fab: {
            pointerEvents: "all",
            margin: theme.spacing(0.5, 0.5),
        },
        paper: {
            margin: theme.spacing(1),
            padding: theme.spacing(3),
            width: "100%",
        },
    })
);

const mapStateToProps = (state: State) => ({
    feedbackOpen: selectIsFeedbackOpen(state),
});

const mapDispatchToProps = {
    setFeedbackOpen: setFeedbackOpenAction,
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const Feedback = ({ feedbackOpen, setFeedbackOpen }: Props) => {
    const classes = useStyles({});
    const { t } = useTranslation("common");
    const ref = useRef();

    useEffect(() => {
        const validation = document.createElement("script");

        validation.src = "//app.icontact.com/icp/static/form/javascripts/validation-captcha.js";
        validation.async = true;
        const tracking = document.createElement("script");

        tracking.src = "////app.icontact.com/icp/static/form/javascripts/tracking.js";
        tracking.async = true;

        setTimeout(() => {
            if (ref && ref.current) {
                // @ts-ignore
                ref.current.appendChild(validation);
                // @ts-ignore
                ref.current.appendChild(tracking);
            }
        }, 2000);
    });

    const handleClose = () => {
        setFeedbackOpen(false);
    };

    const handleOpen = () => {
        sendAnalytics({ type: "event", category: "menu", action: "feedback" });
        setFeedbackOpen(true);
    };

    const getIframeUrl = () => {
        const language = i18next.language || window.localStorage.i18nextLng;
        switch (language) {
            case "fr":
                return "https://extranet.who.int/dataform/828325?newtest=Y&lang=fr";
            case "es":
                return "https://extranet.who.int/dataform/828325?newtest=Y&lang=es";
            default:
                return "https://extranet.who.int/dataform/828325?newtest=Y&lang=en";
        }
    };

    // @ts-ignore
    // @ts-ignore
    return (
        <React.Fragment>
            <Fab
                id="country-button"
                size="small"
                color={"default"}
                className={classes.fab}
                onClick={handleOpen}
                title={t("icons.comments")}
            >
                <FeedbackIcon />
            </Fab>
            <Dialog
                fullWidth
                maxWidth={"md"}
                open={feedbackOpen}
                onClose={handleClose}
                PaperProps={{
                    className: classes.paper,
                }}
            >
                <ButtonWrapper>
                    <FlexGrow />
                    <Button variant="contained" color="primary" onClick={handleClose}>
                        {t("data_download.buttons.close")}
                    </Button>
                </ButtonWrapper>
                <iframe
                    title={"feedback dialog"}
                    src={getIframeUrl()}
                    width={"100%"}
                    height={"800vh"}
                    frameBorder="0"
                    style={{
                        overflowX: "auto",
                    }}
                />
            </Dialog>
        </React.Fragment>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Feedback);
