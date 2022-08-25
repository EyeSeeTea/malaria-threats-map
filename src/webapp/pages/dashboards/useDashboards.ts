import { useEffect, useState } from "react";
import { TreatmentStudy } from "../../../domain/entities/TreatmentStudy";
import { ActionCreator } from "typesafe-actions";
import { ActionTypeEnum } from "../../store/actions";
import { DashboardsState, DashboardsThemeOptions } from "./DashboardsState";

const initialDashboardState = {
    theme: "prevention" as DashboardsThemeOptions,
    selectedCountries: [] as string[],
    countryContext: "all",
    therapeuticResults: "all",
    molecularResults: "all",
    studies: [] as TreatmentStudy[],
    dashboardsData: {},
};

export const useDashboards = (
    treatmentStudies: TreatmentStudy[],
    fetchTreatmentStudies: ActionCreator<ActionTypeEnum.FetchTreatmentStudiesRequest>
) => {
    const [state, setState] = useState<DashboardsState>(initialDashboardState);

    useEffect(() => {
        fetchTreatmentStudies();
    }, [fetchTreatmentStudies]);

    const onThemeChange = (theme: DashboardsThemeOptions) => {
        setState({ ...state, theme });
    };

    const onSelectedCountriesChange = (selectedCountries: string[]) => {
        setState({
            ...state,
            selectedCountries,
            studies: treatmentStudies.filter(study => selectedCountries.includes(study.ISO2)),
        });
    };

    const onCountryContextChange = (countryContext: string) => {
        setState({ ...state, countryContext });
    };

    const onTherapeuticResultsChange = (therapeuticResults: string) => {
        setState({ ...state, therapeuticResults });
    };

    const onMolecularResultsChange = (molecularResults: string) => {
        setState({ ...state, molecularResults });
    };

    return {
        state,
        onThemeChange,
        onSelectedCountriesChange,
        onCountryContextChange,
        onTherapeuticResultsChange,
        onMolecularResultsChange,
    };
};
