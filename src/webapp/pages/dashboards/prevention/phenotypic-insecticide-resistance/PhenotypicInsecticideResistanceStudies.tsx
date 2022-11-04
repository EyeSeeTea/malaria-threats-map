import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Container } from "../../../../components/site-selection-content/SiteSelectionContent";
import MosquitoMortalityOverTimeDashboard from "./MosquitoMortalityOverTimeDashboard";
import ResistanceToInsecticideDashboard from "./ResistanceToInsecticideDashboard";

const PhenotypicInsecticideResistanceStudies: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Container>
            <TitleDivider />
            <Title>{t("common.dashboard.phenotypicInsecticideResistanceDashboards.title")}</Title>
            <ResistanceToInsecticideDashboard />
            <MosquitoMortalityOverTimeDashboard />
        </Container>
    );
};

export default PhenotypicInsecticideResistanceStudies;

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
