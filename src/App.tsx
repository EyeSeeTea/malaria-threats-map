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
import { createMuiTheme, Hidden } from "@material-ui/core";
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
  setInsecticideTypes,
  setPreventionMapType,
  setSpecies,
  setSynergistTypes,
  setType
} from "./store/actions/prevention-actions";
import Disclaimer from "./components/Disclaimer";
import {
  setDiagnosisDeletionType,
  setDiagnosisMapType,
  setDiagnosisPatientType,
  setDiagnosisSurveyTypes
} from "./store/actions/diagnosis-actions";
import {
  setMolecularMarker,
  setTreatmentDrug,
  setTreatmentMapType,
  setTreatmentPlasmodiumSpecies
} from "./store/actions/treatment-actions";
import {
  setInvasiveMapType,
  setInvasiveVectorSpecies
} from "./store/actions/invasive-actions";
import PersistentDrawerLeft from "./components/PersistentDrawerLeft";
import LeyendPopover from "./components/LegendPopover";
import Leyend from "./components/Leyend";

export const { store } = createStore();

ReduxQuerySync({
  store,
  params: {
    theme: {
      selector: (state: State) => state.malaria.theme,
      action: (value: string) => setThemeAction(value || "prevention")
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
          return setPreventionMapType(0);
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
      }
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
    mmType: {
      selector: (state: State) => state.treatment.filters.molecularMarker,
      action: (value: string) => setMolecularMarker(parseInt(value))
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
              <Hidden smUp>
                <PersistentDrawerLeft drawerWidth={325} />
              </Hidden>
              <Hidden xsDown>
                <PersistentDrawerLeft />
              </Hidden>
            </I18nextProvider>
          </DataProvider>
        </Provider>
      </ThemeProvider>
    );
  }
}

export default App;
