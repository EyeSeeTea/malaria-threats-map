import React from "react";
import { connect } from "react-redux";
import { Study } from "../../../domain/entities/Study";
import { Box, Typography } from "@mui/material";
import { selectTheme } from "../../store/reducers/base-reducer";
import { State } from "../../store/types";
import { getSiteTitle } from "./utils";

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;

type OwnProps = {
    title?: string;
    study?: Study;
};
type Props = StateProps & OwnProps;

const SiteTitle: React.FC<Props> = ({ theme, study, title }) => {
    const titleState = React.useMemo(() => {
        return title || getSiteTitle(theme, study);
    }, [title, study, theme]);

    return (
        <Typography variant="subtitle1">
            <Box fontWeight="fontWeightBold">{titleState}</Box>
        </Typography>
    );
};

export default connect(mapStateToProps)(SiteTitle);
