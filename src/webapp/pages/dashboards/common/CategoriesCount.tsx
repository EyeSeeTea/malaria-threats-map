import { Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

interface CategoriesCountProps {
    counts: Record<string, number>;
}

const CategoriesCount: React.FC<CategoriesCountProps> = ({ counts }) => {
    const { t } = useTranslation();

    return (
        <React.Fragment>
            <Typography variant="body1">
                {t("common.dashboard.phenotypicInsecticideResistanceDashboards.numBioassaysByCategory")}
            </Typography>
            <ul style={{ paddingInlineStart: 12, marginBlockStart: 0 }}>
                {Object.keys(counts).map(key => {
                    return (
                        <li key={key}>
                            <Typography variant="body1">{`${t(key)}: ${counts[key]}`}</Typography>
                        </li>
                    );
                })}
            </ul>
        </React.Fragment>
    );
};

export default CategoriesCount;
