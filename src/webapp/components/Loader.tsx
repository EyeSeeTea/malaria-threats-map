import React, { useMemo } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import { PreventionMapType, State } from "../store/types";
import { selectTheme } from "../store/reducers/base-reducer";
import { selectDiagnosisStudiesLoading } from "../store/reducers/diagnosis-reducer";
import { selectInvasiveStudiesLoading } from "../store/reducers/invasive-reducer";
import { selectTreatmentStudiesLoading } from "../store/reducers/treatment-reducer";
import { connect } from "react-redux";
import { selectDistrictsAreLoading } from "../store/reducers/districts-reducer";
import { selectCountryLayerIsLoading } from "../store/reducers/country-layer-reducer";
import { Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
    selectPreventionFilters,
    selectResistanceIntensityStudiesLoading,
    selectResistanceMechanismStudiesLoading,
    selectResistanceStatusStudiesLoading,
    selectSynergistEffectStudiesLoading,
} from "../store/reducers/prevention-reducer";
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
    preventionFilters: selectPreventionFilters(state),
    resistanceStatusStudiesLoading: selectResistanceStatusStudiesLoading(state),
    resistanceIntensityStudiesLoading: selectResistanceIntensityStudiesLoading(state),
    synergistEffectStudiesLoading: selectSynergistEffectStudiesLoading(state),
    resistanceMechanismStudiesLoading: selectResistanceMechanismStudiesLoading(state),
    diagnosisLoading: selectDiagnosisStudiesLoading(state),
    treatmentLoading: selectTreatmentStudiesLoading(state),
    invasiveLoading: selectInvasiveStudiesLoading(state),
    districtsLoading: selectDistrictsAreLoading(state),
    countriesLoading: selectCountryLayerIsLoading(state),
});

type OwnProps = {};
type StateProps = ReturnType<typeof mapStateToProps>;
type Props = StateProps & OwnProps;

function SimpleBackdrop(props: Props) {
    const classes = useStyles(props);
    const { t } = useTranslation();

    const isPreventionLoading = useMemo(() => {
        const loadingByMapType: Record<PreventionMapType, boolean> = {
            [PreventionMapType.RESISTANCE_STATUS]: props.resistanceStatusStudiesLoading,
            [PreventionMapType.INTENSITY_STATUS]: props.resistanceIntensityStudiesLoading,
            [PreventionMapType.RESISTANCE_MECHANISM]: props.resistanceMechanismStudiesLoading,
            [PreventionMapType.LEVEL_OF_INVOLVEMENT]: props.synergistEffectStudiesLoading,
        };

        return loadingByMapType[props.preventionFilters.mapType] ?? false;
    }, [
        props.preventionFilters.mapType,
        props.resistanceIntensityStudiesLoading,
        props.resistanceMechanismStudiesLoading,
        props.resistanceStatusStudiesLoading,
        props.synergistEffectStudiesLoading,
    ]);

    const isLoading = useMemo(() => {
        switch (props.theme) {
            case "prevention":
                return isPreventionLoading || props.districtsLoading || props.countriesLoading;
            case "diagnosis":
                return props.diagnosisLoading || props.countriesLoading;
            case "treatment":
                return props.treatmentLoading || props.countriesLoading;
            case "invasive":
                return props.invasiveLoading || props.countriesLoading;
            default:
                return false;
        }
    }, [
        props.theme,
        props.districtsLoading,
        props.countriesLoading,
        props.diagnosisLoading,
        props.treatmentLoading,
        props.invasiveLoading,
        isPreventionLoading,
    ]);

    return (
        <Backdrop className={classes.backdrop} open={isLoading}>
            <Stack direction="column" alignItems="center">
                <CircularProgress color="inherit" />
                <Typography variant="h4">{t("common.loading")}</Typography>
            </Stack>
        </Backdrop>
    );
}

export default connect(mapStateToProps)(SimpleBackdrop);
