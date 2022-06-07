import React from "react";

import ThemeFilter from "./filters/ThemeFilter";
import { State } from "../../store/types";
import { selectTheme } from "../../store/reducers/base-reducer";
import { setThemeAction } from "../../store/actions/base-actions";
import { connect } from "react-redux";
import { Paper, Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { fetchPreventionStudiesRequest } from "../../store/actions/prevention-actions";
import { fetchTreatmentStudiesRequest } from "../../store/actions/treatment-actions";
import { fetchInvasiveStudiesRequest } from "../../store/actions/invasive-actions";
import DataSetSelector from "./filters/DataSetSelector";

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
});

const mapDispatchToProps = {
    fetchPreventionStudies: fetchPreventionStudiesRequest,
    fetchTreatmentStudies: fetchTreatmentStudiesRequest,
    fetchInvasiveStudies: fetchInvasiveStudiesRequest,
    setTheme: setThemeAction,
};

type OwnProps = {
    onChange: (filters: any) => void;
    selections: any;
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps & OwnProps;

const Filters = ({
    onChange,
    selections,
    fetchInvasiveStudies,
    fetchPreventionStudies,
    fetchTreatmentStudies,
}: Props) => {
    const { t } = useTranslation();

    const onSetTheme = (value: string) => {
        onChange({
            ...selections,
            theme: value,
            years: [],
            countries: [],
        });
    };

    const onSetPreventionDataset = (value: string) => {
        fetchPreventionStudies();
        onChange({
            ...selections,
            preventionDataset: value,
            years: [],
            countries: [],
        });
    };

    const onSetTreatmentDataset = (value: string) => {
        fetchTreatmentStudies();
        onChange({
            ...selections,
            treatmentDataset: value,
            years: [],
            countries: [],
        });
    };

    const onSetInvasiveDataset = (value: string) => {
        fetchInvasiveStudies();
        onChange({
            ...selections,
            invasiveDataset: value,
            years: [],
            countries: [],
        });
    };

    const { theme, preventionDataset, treatmentDataset, invasiveDataset } = selections;

    return (
        <div>
            <Typography variant="subtitle1" color="textSecondary">
                {t("common.data_download.dataset")}
            </Typography>
            <Paper
                style={{
                    paddingTop: "16px",
                    paddingBottom: "16px",
                }}
            >
                <ThemeFilter value={theme} onChange={onSetTheme} />
                {theme === "prevention" && (
                    <DataSetSelector theme={theme} value={preventionDataset} onChange={onSetPreventionDataset} />
                )}
                {theme === "treatment" && (
                    <DataSetSelector theme={theme} value={treatmentDataset} onChange={onSetTreatmentDataset} />
                )}
                {theme === "invasive" && (
                    <DataSetSelector theme={theme} value={invasiveDataset} onChange={onSetInvasiveDataset} />
                )}
            </Paper>
        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
