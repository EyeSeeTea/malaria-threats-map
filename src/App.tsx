import React from "react";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import styled from "styled-components";
import { Provider } from "react-redux";
import createStore from "./store";
import MapContainer from "./MapContainer";
import DataProvider from "./components/DataProvider";
import ReduxQuerySync from "./store/query-middleware";
import { State } from "./store/types";
import { setThemeAction } from "./malaria/actions";

const { store } = createStore();

ReduxQuerySync({
  store,
  params: {
    theme: {
      selector: (state: State) => state.malaria.theme,
      action: setThemeAction
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

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <DataProvider>
          <I18nextProvider i18n={i18next}>
            <PageWrapper>
              <MapContainer />
            </PageWrapper>
          </I18nextProvider>
        </DataProvider>
      </Provider>
    );
  }
}

export default App;
