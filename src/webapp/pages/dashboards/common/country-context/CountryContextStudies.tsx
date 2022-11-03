import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Container } from "../../../../components/site-selection-content/SiteSelectionContent";
import { DashboardsThemeOptions } from "../../types";
import CountryContextDataProvider from "./context/CountryContextDataProvider";
import EpidemiologicalProfileDashboard from "./EpidemiologicalProfileDashboard";
import MajorAnophelesSpeciesDashboard from "./MajorAnophelesSpeciesDashboard";
import MajorPlamociumSpeciesDashboard from "./MajorPlamociumSpeciesDashboard";
import SummaryInsecticideResistanceDashboard from "./SummaryInsecticideResistanceDashboard";

interface CountryContextStudiesProps {
    theme: DashboardsThemeOptions;
}

const CountryContextStudies: React.FC<CountryContextStudiesProps> = ({ theme }) => {
    const { t } = useTranslation();

    return (
        <CountryContextDataProvider>
            <Container>
                <TitleDivider id="country-context" />
                <Title>{t("common.dashboard.countryContextDashboards.title")}</Title>
                {theme === "prevention" ? (
                    <PreventionCountryContextDashboards />
                ) : (
                    <TreatmentCountryContextDashboards />
                )}
            </Container>
        </CountryContextDataProvider>
    );
};

export default React.memo(CountryContextStudies);

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

const PreventionCountryContextDashboards: React.FC = () => {
    return (
        <React.Fragment>
            <EpidemiologicalProfileDashboard />
            <MajorAnophelesSpeciesDashboard />
            <SummaryInsecticideResistanceDashboard />
        </React.Fragment>
    );
};

const TreatmentCountryContextDashboards: React.FC = () => {
    return (
        <React.Fragment>
            <EpidemiologicalProfileDashboard />
            <MajorPlamociumSpeciesDashboard />
        </React.Fragment>
    );
};
