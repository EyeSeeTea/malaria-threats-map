import React from "react";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import styled from "styled-components";
import { Provider } from "react-redux";
import createStore from "./store";
import DataProvider from "./components/DataProvider";
import ReduxQuerySync from "./store/query-middleware";
import { State } from "./store/types";
import { setFiltersAction, setThemeAction } from "./malaria/actions";
import Map from "./components/Map";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import { blue, deepOrange } from "@material-ui/core/colors";

const { store } = createStore();

ReduxQuerySync({
  store,
  params: {
    theme: {
      selector: (state: State) => state.malaria.theme,
      action: setThemeAction
    },
    years: {
      selector: (state: State) => state.malaria.filters,
      action: (value: string) =>
        setFiltersAction(value.split(",").map(value => parseInt(value)))
    }
  },
  initialTruth: "location"
});

const PageWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
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
                <Map />
              </PageWrapper>
            </I18nextProvider>
          </DataProvider>
        </Provider>
      </ThemeProvider>
    );
  }
}

export default App;
