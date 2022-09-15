import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Container } from "../../../../components/site-selection-content/SiteSelectionContent";
import { CountryContext, DashboardsThemeOptions } from "../../types";
import CountryContextDataProvider from "./context/CountryContextDataProvider";
import EpidemiologicalProfileDashboard from "./EpidemiologicalProfileDashboard";
import MajorAnophelesSpeciesDashboard from "./MajorAnophelesSpeciesDashboard";
import MajorPlamociumSpeciesDashboard from "./MajorPlamociumSpeciesDashboard";

interface CountryContextDashboardProps {
    countryContext: CountryContext;
}

interface CountryContextStudiesProps extends CountryContextDashboardProps {
    theme: DashboardsThemeOptions;
}

const CountryContextStudies: React.FC<CountryContextStudiesProps> = ({ countryContext, theme }) => {
    const { t } = useTranslation();

    return (
        <CountryContextDataProvider>
            <Container>
                <TitleDivider />
                <Title>{t("common.dashboard.countryContextDashboards.title")}</Title>
                {theme === "prevention" ? (
                    <PreventionCountryContextDashboards countryContext={countryContext} />
                ) : (
                    <TreatmentCountryContextDashboards countryContext={countryContext} />
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

const PreventionCountryContextDashboards: React.FC<CountryContextDashboardProps> = ({ countryContext }) => {
    return (
        <React.Fragment>
            {(countryContext === "all" || countryContext === "epidemiological-profile") && (
                <EpidemiologicalProfileDashboard />
            )}
            {(countryContext === "all" || countryContext === "major-anopheles-species") && (
                <MajorAnophelesSpeciesDashboard />
            )}
        </React.Fragment>
    );
};

const TreatmentCountryContextDashboards: React.FC<CountryContextDashboardProps> = ({ countryContext }) => {
    return (
        <React.Fragment>
            {(countryContext === "all" || countryContext === "epidemiological-profile") && (
                <EpidemiologicalProfileDashboard />
            )}
            {(countryContext === "all" || countryContext === "major-plasmodium") && <MajorPlamociumSpeciesDashboard />}
        </React.Fragment>
    );
};
