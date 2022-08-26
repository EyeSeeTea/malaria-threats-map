import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Container } from "../../../../components/site-selection-content/SiteSelectionContent";
import { useDashboards } from "../../context/useDashboards";
import ParasiteClearanceOverTimeDashboard from "./ParasiteClearanceOverTimeDashboard";
import TreatmentFailureByDrugDashboard from "./TreatmentFailureByDrugDashboard";
import TreatmentFailureOverTimeDashboard from "./TreatmentFailureOverTimeDashboard";

const TreatmentEfficacyStudies: React.FC = () => {
    const { t } = useTranslation();
    const { therapeuticEfficacy } = useDashboards();

    return (
        <Container>
            <TitleDivider />
            <Title>{t("common.dashboard.therapeuticEfficacySection.title")}</Title>
            {(therapeuticEfficacy === "all" || therapeuticEfficacy === "summary-treatment-failures") && (
                <TreatmentFailureByDrugDashboard />
            )}
            {(therapeuticEfficacy === "all" || therapeuticEfficacy === "treatment-failure-rates") && (
                <TreatmentFailureOverTimeDashboard />
            )}
            {(therapeuticEfficacy === "all" || therapeuticEfficacy === "parasite-clearance-rates") && (
                <ParasiteClearanceOverTimeDashboard />
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
