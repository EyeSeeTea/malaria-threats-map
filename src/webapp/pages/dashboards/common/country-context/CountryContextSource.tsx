import { Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

const CountryContextSource: React.FC = () => {
    const { t } = useTranslation();

    return (
        <React.Fragment>
            <Typography display="inline">{t("common.dashboard.countryContextDashboards.source")}&nbsp;</Typography>
            <a href="https://www.who.int/publications/i/item/9789240040496" color="blue">
                {t("common.dashboard.countryContextDashboards.whoWorldMalariaReport")}
            </a>
        </React.Fragment>
    );
};

export default CountryContextSource;
