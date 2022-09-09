import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Container } from "../../../../components/site-selection-content/SiteSelectionContent";
import { MolecularMarker } from "../types";
import MolecularMarkerDashboard from "./MolecularMarkerOverTimeDashboard";

interface MolecularMarkerStudiesProps {
    molecularMarker: MolecularMarker;
}

const MolecularMarkerStudies: React.FC<MolecularMarkerStudiesProps> = ({ molecularMarker }) => {
    const { t } = useTranslation();

    return (
        <Container>
            <TitleDivider />
            <Title>{t("common.dashboard.MolecularMarkerSection.title")}</Title>
            {(molecularMarker === "all" || molecularMarker === "summary-molecular-marker") && (
                <MolecularMarkerDashboard />
            )}
        </Container>
    );
};

export default MolecularMarkerStudies;

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
