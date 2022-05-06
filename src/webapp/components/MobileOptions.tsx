import React from "react";
import { Theme } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";
import { Dialog, Button, ListItemText, ListItem, List, AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Slide, { SlideProps } from "@mui/material/Slide";
import { State } from "../store/types";
import { selectAreMobileOptionsOpen } from "../store/reducers/base-reducer";
import { setMobileOptionsOpen } from "../store/actions/base-actions";
import { connect } from "react-redux";
import styled from "styled-components";
import { LanguageSelectorDialog, LANGUAGES } from "./LanguageSelectorDialog";
import { changeLanguage } from "../config/i18next";
import { useTranslation } from "react-i18next";

const FlexGrow = styled.div`
    flex-grow: 1;
`;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        appBar: {
            position: "relative",
        },
        title: {
            marginLeft: theme.spacing(2),
            flex: 1,
        },
    })
);

const Transition = React.forwardRef<unknown, SlideProps>((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} />;
});

const mapStateToProps = (state: State) => ({
    areMobileOptionsOpen: selectAreMobileOptionsOpen(state),
});
const mapDispatchToProps = {
    setMobileOptionsOpen: setMobileOptionsOpen,
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

function MobileOptions({ areMobileOptionsOpen, setMobileOptionsOpen }: Props) {
    const classes = useStyles({});
    const [isLanguageOpen, setIsLanguageOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(LANGUAGES[0].value);

    function handleClose() {
        setMobileOptionsOpen(false);
    }

    const handleButtonClickOpen = () => {
        setIsLanguageOpen(true);
    };

    const handleClickClose = (value: string) => {
        changeLanguage(value);
        setIsLanguageOpen(false);
        setSelectedValue(value);
    };
    const { t } = useTranslation();
    return (
        <>
            <Dialog fullScreen open={areMobileOptionsOpen} onClose={handleClose} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar variant="dense">
                        <Typography variant="h6" className={classes.title}>
                            {t("common.options.title")}
                        </Typography>
                        <FlexGrow />
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            size={"small"}
                            aria-label="close"
                        >
                            <ArrowDownwardIcon fontSize={"small"} />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <List>
                    <ListItem button>
                        <ListItemText primary={t("common.options.language")} />
                        <FlexGrow />
                        <Button onClick={handleButtonClickOpen} variant="contained">
                            {t("common.options.select_language")}
                        </Button>
                        <LanguageSelectorDialog
                            selectedValue={selectedValue}
                            open={isLanguageOpen}
                            onClose={handleClickClose}
                        />
                    </ListItem>
                </List>
            </Dialog>
        </>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(MobileOptions);
