import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import TreatmentFailureByDrugDashboard from "./TreatmentFailureByDrugDashboard";
import TreatmentOverTimeDashboard from "./TreatmentOverTimeDashboard";

const TreatmentEfficacyStudies: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Container>
            <TitleDivider />
            <Title id="therapeutic-efficacy">{t("common.dashboard.therapeuticEfficacyDashboards.title")}</Title>
            <TreatmentFailureByDrugDashboard />
            <TreatmentOverTimeDashboard id="treatment-failure-rates" type="treatmentFailure" />
            <TreatmentOverTimeDashboard id="parasite-clearance-rates" type="positiveDay3" />
        </Container>
    );
};

export default TreatmentEfficacyStudies;

const Container = styled.div<{ width?: string; padding?: string }>`
    width: ${props => props.width || "100%"};
    padding: ${props => props.padding || "70px 0px;"};
`;

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
