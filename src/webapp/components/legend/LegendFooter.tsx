import React from "react";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const LegendFooterContainer = styled.div`
    display: flex;
    padding: 20px;
`;

const LegendFooterTypography = styled(Typography)`
    font-size: 0.7rem !important;
`;

const LegendFooter: React.FC = () => {
    const { t } = useTranslation();
    return (
        <LegendFooterContainer>
            <LegendFooterTypography color="textSecondary">
                {t("common.legend.most_recent_data_shown")}
            </LegendFooterTypography>
        </LegendFooterContainer>
    );
};

export default LegendFooter;
