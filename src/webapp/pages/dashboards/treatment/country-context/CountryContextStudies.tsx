import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Container } from "../../../../components/site-selection-content/SiteSelectionContent";
import CountryContextDataProvider from "./context/CountryContextDataProvider";
import MolecularMarkerDashboard from "./EpidemiologicalProfileDashboard";
import MajorPlamociumSpeciesDashboard from "./MajorPlamociumSpeciesDashboard";

const CountryContextStudies: React.FC = () => {
    const { t } = useTranslation();

    return (
        <CountryContextDataProvider>
            <Container>
                <TitleDivider id="country-context" />
                <Title>{t("common.dashboard.countryContextSection.title")}</Title>
                <MolecularMarkerDashboard />
                <MajorPlamociumSpeciesDashboard />
            </Container>
        </CountryContextDataProvider>
    );
};

export default CountryContextStudies;

const TitleDivider = styled.div`
    height: 4px;
    background: #2fb3af;
    width: 100px;
    margin-bottom: 16px;
    border-radius: 5px;
`;

const Title = styled.h2`
    font-size: 30px;
    margin-bottom: 30px;
    color: #636463;
`;
