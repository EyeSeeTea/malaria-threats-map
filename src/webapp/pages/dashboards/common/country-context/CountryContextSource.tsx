import { Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

const CountryContextSource: React.FC = () => {
    const { t } = useTranslation();

    return (
        <React.Fragment>
            <Typography variant="body2" display="inline">
                {t("common.dashboard.countryContextDashboards.source")}&nbsp;
            </Typography>
            <a
                href="https://www.who.int/publications/i/item/9789240086173"
                color="blue"
                target={"_blank"}
                rel="noreferrer"
            >
                <Typography variant="body2" display="inline">
                    {t("common.dashboard.countryContextDashboards.whoWorldMalariaReport")}
                </Typography>
            </a>
        </React.Fragment>
    );
};

export default CountryContextSource;
