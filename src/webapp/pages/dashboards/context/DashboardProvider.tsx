import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { DashboardsThemeOptions, TherapeuticEfficacy } from "../types";
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
    const [countryContext, setCountryContext] = useState<string>("all");
    const [therapeuticEfficacy, setTherapeuticEfficacy] = useState<TherapeuticEfficacy>("all");
    const [molecularMarker, setMolecularMarker] = useState<string>("all");
    const [studies, setStudies] = useState<TreatmentStudy[]>([]);
    const [filteredStudies, setFilteredStudies] = useState<TreatmentStudy[]>([]);
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
        setStudies(treatmentStudies);
        setFilteredStudies(treatmentStudies);
    }, [treatmentStudies]);

    useEffect(() => {
        setUpdatedDates(lastUpdatedDates);
    }, [lastUpdatedDates]);

    return (
        <DashboardContext.Provider
            value={{
                theme,
                selectedCountries,
                countryContext,
                therapeuticEfficacy,
                molecularMarker,
                studies,
                filteredStudies,
                updatedDates,
                setTheme,
                setSelectedCountries,
                setCountryContext,
                setTherapeuticEfficacy,
                setMolecularMarker,
                setFilteredStudies,
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
    countryContext: string;
    therapeuticEfficacy: string;
    molecularMarker: string;
    studies: TreatmentStudy[];
    filteredStudies: TreatmentStudy[];
    updatedDates: LastUpdatedDates;
    setTheme: Dispatch<SetStateAction<DashboardsThemeOptions>>;
    setSelectedCountries: Dispatch<SetStateAction<string[]>>;
    setCountryContext: Dispatch<SetStateAction<string>>;
    setTherapeuticEfficacy: Dispatch<SetStateAction<TherapeuticEfficacy>>;
    setMolecularMarker: Dispatch<SetStateAction<string>>;
    setFilteredStudies: Dispatch<SetStateAction<TreatmentStudy[]>>;
}
