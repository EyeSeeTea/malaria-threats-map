import React from "react";
import Dialog from "@mui/material/Dialog";
import { DialogContent, Theme } from "@mui/material";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import styled from "styled-components";
import { connect } from "react-redux";
import { setPreventionFilteredStudiesAction } from "../store/actions/prevention-actions";
import { setSelection } from "../store/actions/base-actions";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            margin: theme.spacing(2),
            width: "100%",
        },
        content: {
            padding: theme.spacing(2),
        },
        closeIcon: {
            padding: theme.spacing(1),
        },
    })
);

const FlexGrow = styled.div`
    flex-grow: 1;
`;

const Flex = styled.div`
    display: flex;
`;

const mapDispatchToProps = {
    setFilteredStudies: setPreventionFilteredStudiesAction,
    setSelection: setSelection,
};

function ChartModal({ children, selection, setSelection }: any) {
    const classes = useStyles({});

    function closeModal() {
        setSelection(null);
    }

    return (
        <Dialog
            fullWidth={true}
            maxWidth={"xl"}
            open={!!selection}
            onClose={closeModal}
            PaperProps={{
                className: classes.paper,
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <Flex>
                <FlexGrow />
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={closeModal}
                    size={"small"}
                    aria-label="close"
                    className={classes.closeIcon}
                >
                    <CloseIcon fontSize={"small"} />
                </IconButton>
            </Flex>
            <DialogContent className={classes.content}>{children}</DialogContent>
        </Dialog>
    );
}

export default connect(null, mapDispatchToProps)(ChartModal);
