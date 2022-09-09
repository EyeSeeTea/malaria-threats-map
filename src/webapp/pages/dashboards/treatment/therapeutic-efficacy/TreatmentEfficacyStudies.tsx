import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Container } from "../../../../components/site-selection-content/SiteSelectionContent";
import { TherapeuticEfficacy } from "../types";
import TreatmentFailureByDrugDashboard from "./TreatmentFailureByDrugDashboard";
import TreatmentOverTimeDashboard from "./TreatmentOverTimeDashboard";

interface TreatmentEfficacyStudiesProps {
    therapeuticEfficacy: TherapeuticEfficacy;
}

const TreatmentEfficacyStudies: React.FC<TreatmentEfficacyStudiesProps> = ({ therapeuticEfficacy }) => {
    const { t } = useTranslation();

    return (
        <Container>
            <TitleDivider />
            <Title>{t("common.dashboard.therapeuticEfficacySection.title")}</Title>
            {(therapeuticEfficacy === "all" || therapeuticEfficacy === "summary-treatment-failures") && (
                <TreatmentFailureByDrugDashboard />
            )}
            {(therapeuticEfficacy === "all" || therapeuticEfficacy === "treatment-failure-rates") && (
                <TreatmentOverTimeDashboard type="treatmentFailure" />
            )}
            {(therapeuticEfficacy === "all" || therapeuticEfficacy === "parasite-clearance-rates") && (
                <TreatmentOverTimeDashboard type="positiveDay3" />
            )}
        </Container>
    );
};

export default TreatmentEfficacyStudies;

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
