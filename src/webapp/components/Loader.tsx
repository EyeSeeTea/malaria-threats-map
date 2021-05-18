import React from "react";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { State } from "../store/types";
import { selectTheme } from "../store/reducers/base-reducer";
import { selectPreventionStudiesLoading } from "../store/reducers/prevention-reducer";
import { selectDiagnosisStudiesLoading } from "../store/reducers/diagnosis-reducer";
import { selectInvasiveStudiesLoading } from "../store/reducers/invasive-reducer";
import { selectTreatmentStudiesLoading } from "../store/reducers/treatment-reducer";
import { connect } from "react-redux";
import { selectDistrictsAreLoading } from "../store/reducers/districts-reducer";
import { selectCountryLayerIsLoading } from "../store/reducers/country-layer-reducer";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: "#fff",
        },
    })
);

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    preventionLoading: selectPreventionStudiesLoading(state),
    diagnosisLoading: selectDiagnosisStudiesLoading(state),
    treatmentLoading: selectTreatmentStudiesLoading(state),
    invasiveLoading: selectInvasiveStudiesLoading(state),
    districtsLoading: selectDistrictsAreLoading(state),
    countriesLoading: selectCountryLayerIsLoading(state),
});

const mapDispatchToProps = {};
type OwnProps = {};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps & OwnProps;

function SimpleBackdrop(props: Props) {
    const classes = useStyles(props);

    const isLoading = () => {
        switch (props.theme) {
            case "prevention":
                return props.preventionLoading || props.districtsLoading || props.countriesLoading;
            case "diagnosis":
                return props.diagnosisLoading || props.countriesLoading;
            case "treatment":
                return props.treatmentLoading || props.countriesLoading;
            case "invasive":
                return props.invasiveLoading || props.countriesLoading;
            default:
                return false;
        }
    };

    return (
        <div>
            <Backdrop className={classes.backdrop} open={isLoading()}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(SimpleBackdrop);
