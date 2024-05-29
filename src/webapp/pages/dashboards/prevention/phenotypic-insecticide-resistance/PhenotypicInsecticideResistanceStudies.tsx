import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import MosquitoMortalityOverTimeDashboard from "./MosquitoMortalityOverTimeDashboard";
import ResistanceToInsecticideDashboard from "./resistance-to-insecticided-dashboard/ResistanceToInsecticideDashboard";
import SpreadResistanceOverTimeDashboard from "./spread-of-resistance-over-time-dashboard/SpreadResistanceOverTimeDashboard";

const PhenotypicInsecticideResistanceStudies: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Container>
            <TitleDivider />
            <Title>{t("common.dashboard.phenotypicInsecticideResistanceDashboards.title")}</Title>
            <ResistanceToInsecticideDashboard />
            <MosquitoMortalityOverTimeDashboard />
            <SpreadResistanceOverTimeDashboard />
        </Container>
    );
};

export default PhenotypicInsecticideResistanceStudies;

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
