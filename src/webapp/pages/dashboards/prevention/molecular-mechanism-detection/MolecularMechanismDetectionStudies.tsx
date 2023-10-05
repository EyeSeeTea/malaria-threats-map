import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import InsecticideResistanceAndResistanceMechanismsDashboard from "./insecticide-resistance-resistance-mechanisms-dashboard/InsecticideResistanceAndResistanceMechanismsDashboard";

const MolecularMechanismDetectionStudies: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Container>
            <TitleDivider />
            <Title>{t("common.dashboard.molecularMechanismDetectionDashboards.title")}</Title>
            <InsecticideResistanceAndResistanceMechanismsDashboard />
        </Container>
    );
};

export default MolecularMechanismDetectionStudies;

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
