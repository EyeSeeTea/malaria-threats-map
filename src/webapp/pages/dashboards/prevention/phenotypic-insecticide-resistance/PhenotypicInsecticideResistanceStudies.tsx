import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Container } from "../../../../components/site-selection-content/SiteSelectionContent";
import { PhenotypicInsecticideResistance } from "../types";
import ResistanceToInsecticideDashboard from "./ResistanceToInsecticideDashboard";

interface TreatmentEfficacyStudiesProps {
    phenotypicInsecticideResistance: PhenotypicInsecticideResistance;
}

const TreatmentEfficacyStudies: React.FC<TreatmentEfficacyStudiesProps> = ({ phenotypicInsecticideResistance }) => {
    const { t } = useTranslation();

    return (
        <Container>
            <TitleDivider />
            <Title>{t("common.dashboard.phenotypicInsecticideResistanceDashboards.title")}</Title>
            {(phenotypicInsecticideResistance === "all" ||
                phenotypicInsecticideResistance === "status-resistance-insecticide") && (
                <ResistanceToInsecticideDashboard />
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
