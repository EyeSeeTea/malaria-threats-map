import React from "react";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import { Provider } from "react-redux";
import createStore from "./store";
import DataProvider from "./components/DataProvider";
import ReduxQuerySync from "./store/query-middleware";
import { PreventionMapType, State } from "./store/types";
import { Theme, StyledEngineProvider } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import {
    setBoundsAction,
    setCountryModeAction,
    setFiltersAction,
    setFiltersMode,
    setFiltersOpen,
    setRegionAction,
    setStoryModeAction,
    setStoryModeStepAction,
    setThemeAction,
    toggleEndemicityLayerAction,
} from "./store/actions/base-actions";
import {
    setAssayTypes,
    setInsecticideClass,
    setInsecticideTypes,
    setPreventionMapType,
    setSpecies,
    setSynergistTypes,
    setType,
} from "./store/actions/prevention-actions";
import {
    setDiagnosisDeletionType,
    setDiagnosisMapType,
    setDiagnosisPatientType,
    setDiagnosisSurveyTypes,
} from "./store/actions/diagnosis-actions";
import {
    setExcludeLowerPatients,
    setExcludeLowerSamples,
    setMolecularMarker,
    setTreatmentDrug,
    setTreatmentMapType,
    setTreatmentPlasmodiumSpecies,
} from "./store/actions/treatment-actions";
import { setInvasiveMapType, setInvasiveVectorSpecies } from "./store/actions/invasive-actions";
import { Router } from "./pages/Router";

declare module "@mui/styles/defaultTheme" {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DefaultTheme extends Theme {}
}

export const { store } = createStore();

ReduxQuerySync({
    store,
    params: {
        theme: {
            selector: (state: State) => state.malaria.theme,
            action: (value: string) => setThemeAction(value || "prevention"),
        },
        mapType: {
            selector: (state: State) => {
                switch (state.malaria.theme) {
                    case "prevention":
                        return `prevention:${state.prevention.filters.mapType}`;
                    case "diagnosis":
                        return `diagnosis:${state.diagnosis.filters.mapType}`;
                    case "treatment":
                        return `treatment:${state.treatment.filters.mapType}`;
                    case "invasive":
                        return `invasive:${state.invasive.filters.mapType}`;
                    default:
                        return `prevention:0`;
                }
            },
            action: (value: string) => {
                if (!value) {
                    return setPreventionMapType(PreventionMapType.RESISTANCE_STATUS);
                }
                const pair = value.split(":");
                const mapType: number = parseInt(pair[1]);
                if (isNaN(mapType)) {
                    return setPreventionMapType(mapType);
                }
                switch (pair[0]) {
                    case "prevention":
                        return setPreventionMapType(mapType);
                    case "diagnosis":
                        return setDiagnosisMapType(mapType);
                    case "treatment":
                        return setTreatmentMapType(mapType);
                    case "invasive":
                        return setInvasiveMapType(mapType);
                    default:
                        return setPreventionMapType(mapType);
                }
            },
        },
        bounds: {
            selector: (state: State) => JSON.stringify(state.malaria.bounds),
            action: (value: string) => setBoundsAction(value ? JSON.parse(value) : undefined),
        },
        insecticideClass: {
            selector: (state: State) => state.prevention.filters.insecticideClass,
            action: (value: string) => setInsecticideClass(value),
        },
        insecticideTypes: {
            selector: (state: State) => state.prevention.filters.insecticideTypes,
            action: (value: string) => setInsecticideTypes(value ? value.split(",") : undefined),
        },
        assayTypes: {
            selector: (state: State) => state.prevention.filters.assayTypes,
            action: (value: string) => setAssayTypes(value ? value.split(",") : undefined),
        },
        synergistTypes: {
            selector: (state: State) => state.prevention.filters.synergistTypes,
            action: (value: string) => setSynergistTypes(value ? value.split(",") : undefined),
        },
        type: {
            selector: (state: State) => state.prevention.filters.type,
            action: (value: string) => setType(value),
        },
        species: {
            selector: (state: State) => state.prevention.filters.species,
            action: (value: string) => setSpecies(value ? value.split(",") : undefined),
        },
        vectorSpecies: {
            selector: (state: State) => state.invasive.filters.vectorSpecies,
            action: (value: string) => setInvasiveVectorSpecies(value ? value.split(",") : undefined),
        },
        surveyTypes: {
            selector: (state: State) => state.diagnosis.filters.surveyTypes,
            action: (value: string) => setDiagnosisSurveyTypes(value ? value.split(",") : undefined),
        },
        patientType: {
            selector: (state: State) => state.diagnosis.filters.patientType,
            action: (value: string) => setDiagnosisPatientType(value),
        },
        deletionType: {
            selector: (state: State) => state.diagnosis.filters.deletionType,
            action: (value: string) => setDiagnosisDeletionType(value),
        },
        plasmodiumSpecies: {
            selector: (state: State) => state.treatment.filters.plasmodiumSpecies,
            action: (value: string) => setTreatmentPlasmodiumSpecies(value),
        },
        drug: {
            selector: (state: State) => state.treatment.filters.drug,
            action: (value: string) => setTreatmentDrug(value),
        },
        mmType: {
            selector: (state: State) => state.treatment.filters.molecularMarker,
            action: (value: string) => setMolecularMarker(parseInt(value)),
        },
        excludeLowerPatients: {
            selector: (state: State) => state.treatment.filters.excludeLowerPatients,
            action: (value: boolean) => setExcludeLowerPatients(value),
        },
        excludeLowerSamples: {
            selector: (state: State) => state.treatment.filters.excludeLowerSamples,
            action: (value: boolean) => setExcludeLowerSamples(value),
        },
        endemicity: {
            selector: (state: State) => state.malaria.endemicity,
            action: (value: string) => toggleEndemicityLayerAction(value === "true"),
        },
        countryMode: {
            selector: (state: State) => state.malaria.countryMode,
            action: (value: string) => setCountryModeAction(value === "true"),
        },
        storyMode: {
            selector: (state: State) => state.malaria.storyMode,
            action: (value: string) => setStoryModeAction(value === "true"),
        },
        storyModeStep: {
            selector: (state: State) => state.malaria.storyModeStep,
            action: (value: string) => setStoryModeStepAction(parseInt(value)),
        },
        filterOpen: {
            selector: (state: State) => state.malaria.filtersOpen,
            action: (value: string) => setFiltersOpen(!value ? true : value === "true"),
        },
        filtersMode: {
            selector: (state: State) => state.malaria.filtersMode,
            action: (value: string) => setFiltersMode(value),
        },
        years: {
            selector: (state: State) => state.malaria.filters,
            action: (value: string) =>
                setFiltersAction(value ? value.split(",").map(value => parseInt(value)) : undefined),
        },
        region: {
            selector: (state: State) => {
                if (state.malaria.region.country) {
                    return `country:${state.malaria.region.country}`;
                }
                if (state.malaria.region.region) {
                    return `region:${state.malaria.region.region}`;
                }
                if (state.malaria.region.subRegion) {
                    return `subRegion:${state.malaria.region.subRegion}`;
                }
                if (state.malaria.region.site) {
                    const site = `site:${encodeURI(
                        JSON.stringify({
                            siteIso2: state.malaria.region.siteIso2,
                            site: state.malaria.region.site,
                            siteCoordinates: state.malaria.region.siteCoordinates,
                        })
                    )}`;
                    return site;
                }
            },
            action: (value: string) => {
                const [type, ...rest] = value.split(":");
                switch (type) {
                    case "country":
                        return setRegionAction({ country: rest[1] });
                    case "region":
                        return setRegionAction({ region: rest[1] });
                    case "subRegion":
                        return setRegionAction({ subRegion: rest[1] });
                    case "site": {
                        const { siteIso2, site, siteCoordinates } = JSON.parse(decodeURIComponent(rest.join(":")));
                        return setRegionAction({
                            siteIso2,
                            site,
                            siteCoordinates,
                        });
                    }
                    default:
                        return setRegionAction({ subRegion: rest[1] });
                }
            },
        },
    },
    initialTruth: "location",
});

export const theme = createTheme({
    palette: {
        primary: {
            main: "#2fb3af",
        },
        secondary: {
            main: "#d86422",
        },
        grey: {
            // This is the unique simple approach in @mui v5 to change default and hover fab background-color
            // set by theme, styled or makeStyles provoke color errors to assign color to primary
            300: "#FFFFFF",
            A100: "#e0e0e0",
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    fontSize: "0.875rem",
                    lineHeight: 1.43,
                    letterSpacing: "0.01071em",
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: "standard",
            },
        },
        MuiFormControl: {
            defaultProps: {
                variant: "standard",
            },
        },
        MuiSelect: {
            defaultProps: {
                variant: "standard",
            },
        },
        MuiLink: {
            defaultProps: {
                underline: "hover",
            },
        },
    },
});

class App extends React.Component {
    render() {
        return (
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme}>
                    <Provider store={store}>
                        <DataProvider>
                            <I18nextProvider i18n={i18next}>
                                <Router />
                            </I18nextProvider>
                        </DataProvider>
                    </Provider>
                </ThemeProvider>
            </StyledEngineProvider>
        );
    }
}

export default App;
