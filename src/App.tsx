import React from "react";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import Map from "./components/Map";
import styled from "styled-components";

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
      <I18nextProvider i18n={i18next}>
        <PageWrapper>
          <Map />
        </PageWrapper>
      </I18nextProvider>
    );
  }
}

export default App;
