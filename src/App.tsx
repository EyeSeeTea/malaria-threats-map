import React from "react";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import styled from "styled-components";
import { Provider } from "react-redux";
import createStore from "./store";
import DataProvider from "./components/DataProvider";
import ReduxQuerySync from "./store/query-middleware";
import { State } from "./store/types";
import Map from "./components/Map";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import {
  setCountryModeAction,
  setFiltersAction,
  setRegionAction,
  setThemeAction,
  toggleEndemicityLayerAction
} from "./store/actions/base-actions";
import {
  setAssayTypes,
  setInsecticideClass,
  setInsecticideTypes,
  setPreventionMapType,
  setSpecies,
  setSynergistTypes,
  setType
} from "./store/actions/prevention-actions";
import Disclaimer from "./components/Disclaimer";
import {
  setDiagnosisDeletionType,
  setDiagnosisPatientType,
  setDiagnosisSurveyTypes
} from "./store/actions/diagnosis-actions";
import {
  setTreatmentDrug,
  setTreatmentPlasmodiumSpecies
} from "./store/actions/treatment-actions";
import { setInvasiveVectorSpecies } from "./store/actions/invasive-actions";

export const { store } = createStore();

ReduxQuerySync({
  store,
  params: {
    theme: {
      selector: (state: State) => state.malaria.theme,
      action: (value: string) => setThemeAction(value || "prevention")
    },
    mapType: {
      selector: (state: State) => state.prevention.filters.mapType,
      action: (value: string) =>
        setPreventionMapType(value ? parseInt(value) : 0)
    },
    insecticideClass: {
      selector: (state: State) => state.prevention.filters.insecticideClass,
      action: (value: string) => setInsecticideClass(value)
    },
    insecticideTypes: {
      selector: (state: State) => state.prevention.filters.insecticideTypes,
      action: (value: string) =>
        setInsecticideTypes(value ? value.split(",") : undefined)
    },
    assayTypes: {
      selector: (state: State) => state.prevention.filters.assayTypes,
      action: (value: string) =>
        setAssayTypes(value ? value.split(",") : undefined)
    },
    synergistTypes: {
      selector: (state: State) => state.prevention.filters.synergistTypes,
      action: (value: string) =>
        setSynergistTypes(value ? value.split(",") : undefined)
    },
    type: {
      selector: (state: State) => state.prevention.filters.type,
      action: (value: string) => setType(value)
    },
    species: {
      selector: (state: State) => state.prevention.filters.species,
      action: (value: string) =>
        setSpecies(value ? value.split(",") : undefined)
    },
    vectorSpecies: {
      selector: (state: State) => state.invasive.filters.vectorSpecies,
      action: (value: string) =>
        setInvasiveVectorSpecies(value ? value.split(",") : undefined)
    },
    surveyTypes: {
      selector: (state: State) => state.diagnosis.filters.surveyTypes,
      action: (value: string) =>
        setDiagnosisSurveyTypes(value ? value.split(",") : undefined)
    },
    patientType: {
      selector: (state: State) => state.diagnosis.filters.patientType,
      action: (value: string) => setDiagnosisPatientType(value)
    },
    deletionType: {
      selector: (state: State) => state.diagnosis.filters.deletionType,
      action: (value: string) => setDiagnosisDeletionType(value)
    },
    plasmodiumSpecies: {
      selector: (state: State) => state.treatment.filters.plasmodiumSpecies,
      action: (value: string) => setTreatmentPlasmodiumSpecies(value)
    },
    drug: {
      selector: (state: State) => state.treatment.filters.drug,
      action: (value: string) => setTreatmentDrug(value)
    },
    endemicity: {
      selector: (state: State) => state.malaria.endemicity,
      action: (value: string) => toggleEndemicityLayerAction(value === "true")
    },
    countryMode: {
      selector: (state: State) => state.malaria.countryMode,
      action: (value: string) => setCountryModeAction(value === "true")
    },
    years: {
      selector: (state: State) => state.malaria.filters,
      action: (value: string) =>
        setFiltersAction(
          value ? value.split(",").map(value => parseInt(value)) : undefined
        )
    },
    country: {
      selector: (state: State) => state.malaria.region.country,
      action: (value: string) =>
        setRegionAction({
          country: value
        })
    }
  },
  initialTruth: "location"
});

const PageWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const MapWrapper = styled.div`
  flex: 1;
  position: relative;
`;

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#008dc9"
    },
    secondary: {
      main: "#d86422"
    }
  },
  overrides: {
    MuiFab: {
      root: {
        backgroundColor: "white"
      }
    },
    MuiButton: {
      contained: {
        backgroundColor: "white"
      }
    }
  }
});

class App extends React.Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <DataProvider>
            <I18nextProvider i18n={i18next}>
              <PageWrapper>
                <MapWrapper id={"capture"}>
                  <Map />
                </MapWrapper>
                <Disclaimer />
              </PageWrapper>
            </I18nextProvider>
          </DataProvider>
        </Provider>
      </ThemeProvider>
    );
  }
}

export default App;
