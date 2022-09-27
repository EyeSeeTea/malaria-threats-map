import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Container } from "../../../../components/site-selection-content/SiteSelectionContent";
import { useDashboards } from "../../context/useDashboards";
import CountryContextDataProvider from "./context/CountryContextDataProvider";
import MolecularMarkerDashboard from "./EpidemiologicalProfileDashboard";
import MajorPlamociumSpeciesDashboard from "./MajorPlamociumSpeciesDashboard";

const CountryContextStudies: React.FC = () => {
    const { t } = useTranslation();
    const { countryContext } = useDashboards();

    return (
        <CountryContextDataProvider>
            <Container>
                <TitleDivider />
                <Title>{t("common.dashboard.countryContextSection.title")}</Title>
                {(countryContext === "all" || countryContext === "epidemiological-profile") && (
                    <MolecularMarkerDashboard />
                )}
                {(countryContext === "all" || countryContext === "major-plasmodium") && (
                    <MajorPlamociumSpeciesDashboard />
                )}
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
