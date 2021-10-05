import React from "react";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Typography } from "@material-ui/core";
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: "#fff",
        },
    })
);

interface SimpleLoaderProps {
    message?: string;
}

const SimpleLoader: React.FC<SimpleLoaderProps> = ({ message }) => {
    const classes = useStyles();

    return (
        <div>
            <Backdrop className={classes.backdrop} open={true}>
                {message ? <Typography variant="h4">{message}</Typography> : <CircularProgress color="inherit" />}
            </Backdrop>
        </div>
    );
};

export default connect()(SimpleLoader);
