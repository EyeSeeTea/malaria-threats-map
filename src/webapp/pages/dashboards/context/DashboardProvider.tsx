import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { DashboardsThemeOptions } from "../types";
import React from "react";
import { selectTreatmentStudies } from "../../../store/reducers/treatment-reducer";
import { fetchTreatmentStudiesRequest } from "../../../store/actions/treatment-actions";
import { State } from "../../../store/types";
import { connect } from "react-redux";
import { selectLastUpdatedDates } from "../../../store/reducers/base-reducer";
import { TreatmentStudy } from "../../../../domain/entities/TreatmentStudy";
import { fetchPreventionStudiesRequest } from "../../../store/actions/prevention-actions";
import {
    selectPreventionStudies,
    selectPreventionStudiesOfDefaultDisease,
} from "../../../store/reducers/prevention-reducer";
import { PreventionStudy } from "../../../../domain/entities/PreventionStudy";
import { LastUpdatedDates } from "../../../../domain/entities/LastUpdateDates";
import SimpleLoader from "../../../components/SimpleLoader";
import { useTranslation } from "react-i18next";

export const DashboardContext = React.createContext<DashboardState>(null);

/**
 * Whether the studies of the dashboards have arrived. Prevention counts every study, whatever its
 * disease: the dashboards show only the default disease, and with no study of it they must not stay loading.
 */
export function selectDashboardStudiesLoaded(state: State): boolean {
    return selectPreventionStudies(state).length !== 0 && selectTreatmentStudies(state).length !== 0;
}

const mapStateToProps = (state: State) => ({
    preventionStudies: selectPreventionStudiesOfDefaultDisease(state),
    treatmentStudies: selectTreatmentStudies(state),
    studiesLoaded: selectDashboardStudiesLoaded(state),
    lastUpdatedDates: selectLastUpdatedDates(state),
});

const mapDispatchToProps = {
    fetchTreatmentStudies: fetchTreatmentStudiesRequest,
    fetchPreventionStudies: fetchPreventionStudiesRequest,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const DashboardProvider: React.FC<Props> = ({
    children,
    preventionStudies,
    treatmentStudies,
    studiesLoaded,
    fetchPreventionStudies,
    fetchTreatmentStudies,
    lastUpdatedDates,
}) => {
    const [theme, setTheme] = useState<DashboardsThemeOptions>();
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
    const [dashboardsPreventionStudies, setDashboardsPreventionStudies] = useState<PreventionStudy[]>(undefined);
    const [dashboardsTreatmentStudies, setDashboardsTreatmentStudies] = useState<TreatmentStudy[]>(undefined);
    const [updatedDates, setUpdatedDates] = useState<LastUpdatedDates>({
        prevention: null,
        diagnosisOngoing: null,
        diagnosis: null,
        treatment: null,
        treatmentMMOngoing: null,
        treatmentTESOngoing: null,
        invasive: null,
    });

    const { t } = useTranslation();

    useEffect(() => {
        fetchPreventionStudies();

        fetchTreatmentStudies();
    }, [fetchPreventionStudies, fetchTreatmentStudies]);

    useEffect(() => {
        setUpdatedDates(lastUpdatedDates);
    }, [lastUpdatedDates]);

    return (
        <DashboardContext.Provider
            value={{
                theme,
                selectedCountries,
                preventionStudies,
                treatmentStudies,
                dashboardsPreventionStudies,
                dashboardsTreatmentStudies,
                updatedDates,
                setTheme,
                setSelectedCountries,
                setDashboardsTreatmentStudies,
                setDashboardsPreventionStudies,
            }}
        >
            {studiesLoaded ? children : <SimpleLoader message={t("common.loading")} />}
        </DashboardContext.Provider>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardProvider);

interface DashboardState {
    theme: DashboardsThemeOptions;
    selectedCountries: string[];
    treatmentStudies: TreatmentStudy[];
    preventionStudies: PreventionStudy[];
    dashboardsPreventionStudies: PreventionStudy[];
    dashboardsTreatmentStudies: TreatmentStudy[];
    updatedDates: LastUpdatedDates;
    setTheme: Dispatch<SetStateAction<DashboardsThemeOptions>>;
    setSelectedCountries: Dispatch<SetStateAction<string[]>>;
    setDashboardsPreventionStudies: Dispatch<SetStateAction<PreventionStudy[]>>;
    setDashboardsTreatmentStudies: Dispatch<SetStateAction<TreatmentStudy[]>>;
}
