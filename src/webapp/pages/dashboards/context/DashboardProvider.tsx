import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { DashboardsThemeOptions } from "../types";
import React from "react";
import { selectTreatmentStudies } from "../../../store/reducers/treatment-reducer";
import { fetchTreatmentStudiesRequest } from "../../../store/actions/treatment-actions";
import { LastUpdatedDates, State } from "../../../store/types";
import { connect } from "react-redux";
import { selectLastUpdatedDates } from "../../../store/reducers/base-reducer";
import { TreatmentStudy } from "../../../../domain/entities/TreatmentStudy";

export const DashboardContext = React.createContext<DashboardState>(null);

const mapStateToProps = (state: State) => ({
    treatmentStudies: selectTreatmentStudies(state),
    lastUpdatedDates: selectLastUpdatedDates(state),
});

const mapDispatchToProps = {
    fetchTreatmentStudies: fetchTreatmentStudiesRequest,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const DashboardProvider: React.FC<Props> = ({
    children,
    treatmentStudies,
    fetchTreatmentStudies,
    lastUpdatedDates,
}) => {
    const [theme, setTheme] = useState<DashboardsThemeOptions>("prevention");
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
    const [dashboardsTreatmentStudies, setDashboardsTreatmentStudies] = useState<TreatmentStudy[]>(undefined);
    const [updatedDates, setUpdatedDates] = useState<LastUpdatedDates>({
        prevention: null,
        diagnosis: null,
        treatment: null,
        invasive: null,
    });

    useEffect(() => {
        fetchTreatmentStudies();
    }, [fetchTreatmentStudies]);

    useEffect(() => {
        setUpdatedDates(lastUpdatedDates);
    }, [lastUpdatedDates]);

    return (
        <DashboardContext.Provider
            value={{
                theme,
                selectedCountries,
                treatmentStudies,
                dashboardsTreatmentStudies,
                updatedDates,
                setTheme,
                setSelectedCountries,
                setDashboardsTreatmentStudies,
            }}
        >
            {children}
        </DashboardContext.Provider>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardProvider);

interface DashboardState {
    theme: DashboardsThemeOptions;
    selectedCountries: string[];
    treatmentStudies: TreatmentStudy[];
    dashboardsTreatmentStudies: TreatmentStudy[];
    updatedDates: LastUpdatedDates;
    setTheme: Dispatch<SetStateAction<DashboardsThemeOptions>>;
    setSelectedCountries: Dispatch<SetStateAction<string[]>>;
    setDashboardsTreatmentStudies: Dispatch<SetStateAction<TreatmentStudy[]>>;
}
