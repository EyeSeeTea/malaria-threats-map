import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from "@material-ui/core/transitions";
import { State } from "../store/types";
import { selectAreMobileOptionsOpen } from "../store/reducers/base-reducer";
import { setMobileOptionsOpen } from "../store/actions/base-actions";
import { connect } from "react-redux";
import styled from "styled-components";
import { Typography } from "@material-ui/core";
import LanguageSelectorSelect from "./LanguageSelectorSelect";
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

const Transition = React.forwardRef<unknown, TransitionProps>(function Transition(props, ref) {
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

    function handleClose() {
        setMobileOptionsOpen(false);
    }
    const { t } = useTranslation("common");
    return (
        <>
            <Dialog fullScreen open={areMobileOptionsOpen} onClose={handleClose} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar variant="dense">
                        <Typography variant="h6" className={classes.title}>
                            {t("options.title")}
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
                        <ListItemText primary={t("options.select_language")} />
                        <FlexGrow />
                        <LanguageSelectorSelect />
                    </ListItem>
                </List>
            </Dialog>
        </>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(MobileOptions);
