import React from "react";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import styled from "styled-components";
import { Provider } from "react-redux";
import createStore from "./store";
import DataProvider from "./components/DataProvider";
import ReduxQuerySync from "./store/query-middleware";
import { State } from "./store/types";
import {
  setFiltersAction,
  setRegionAction,
  setThemeAction
} from "./malaria/actions";
import Map from "./components/Map";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import { blue, deepOrange } from "@material-ui/core/colors";
import {
  setInsecticideClass,
  setPreventionMapType
} from "./malaria/prevention/actions";
import InitialDialog from "./components/InitialDialog";

const { store } = createStore();

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

const Disclaimer = styled.div`
  font-size: 60%;
  line-height: 11px;
  background-color: #e0e0e0;
  flex-grow: 0;
  color: rgba(0, 0, 0, 0.87);
  padding: 5px;
`;

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: deepOrange
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
                <MapWrapper>
                  <Map />
                </MapWrapper>

                <Disclaimer>
                  The boundaries and names shown and the designations used on
                  this map do not imply the expression of any opinion whatsoever
                  on the part of the World Health Organization concerning the
                  legal status of any country, territory, city or area or of its
                  authorities, or concerning the delimitation of its frontiers
                  or boundaries. Dotted and dashed lines or grey areas on maps
                  represent approximate border lines or areas for which there
                  may not yet be full agreement. The borders of the map provided
                  reflect the current political and geographic status as of the
                  date of publication (2017). However, the technical health
                  information is based on data accurate with respect to the year
                  selected. The disconnect in this arrangement should be noted
                  but no implications regarding political or terminological
                  status should be drawn from this arrangement as it is purely a
                  function of technical and graphical limitations. Data source:
                  Global Malaria Programme. Map production: Global Malaria
                  Programme. World Health Organization. WHO 2019. All rights
                  reserved.
                </Disclaimer>
              </PageWrapper>
            </I18nextProvider>
          </DataProvider>
        </Provider>
      </ThemeProvider>
    );
  }
}

export default App;
