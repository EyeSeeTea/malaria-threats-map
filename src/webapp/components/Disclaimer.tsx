import React from "react";
import styled from "styled-components";
import Dialog from "@material-ui/core/Dialog";
import CloseIcon from "@material-ui/icons/Close";
import { createStyles, DialogActions, DialogContent, Hidden, IconButton, makeStyles, Theme } from "@material-ui/core";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginTop: theme.spacing(1),
        },
        paper: {
            margin: theme.spacing(1),
            width: "100%",
        },
    })
);

const DisclaimerText = styled.div`
    font-size: 60%;
    line-height: 11px;
    background-color: #e0e0e0;
    flex-grow: 0;
    color: rgba(0, 0, 0, 0.87);
    padding: 5px;
`;

const DisclaimerTextButton = styled(DisclaimerText)`
    cursor: pointer;
`;

const Disclaimer = () => {
    const [open, setOpen] = React.useState(false);
    const classes = useStyles({});
    const { t } = useTranslation();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const renderDisclaimer = () => <>{t("common.copyright.content", { year: new Date().getFullYear() })}</>;

    return (
        <div>
            <Hidden smUp>
                <DisclaimerTextButton onClick={handleClickOpen}>{t("common.copyright.mobile")}</DisclaimerTextButton>
                <Dialog
                    fullWidth
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        className: classes.paper,
                    }}
                >
                    <DialogActions>
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </DialogActions>
                    <DialogContent>{renderDisclaimer()}</DialogContent>
                    <DialogActions />
                </Dialog>
            </Hidden>
            <Hidden xsDown>
                <DisclaimerText>{renderDisclaimer()}</DisclaimerText>
            </Hidden>
        </div>
    );
};

export default Disclaimer;
