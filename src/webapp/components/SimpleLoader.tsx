import React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import { connect } from "react-redux";
import { Typography } from "@mui/material";
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
