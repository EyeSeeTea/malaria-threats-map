import { Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

const CountryContextSource: React.FC = () => {
    const { t } = useTranslation();

    return (
        <React.Fragment>
            <Typography display="inline">{t("common.dashboard.countryContextSection.source")}&nbsp;</Typography>
            <a href="https://www.who.int/publications/i/item/9789240040496" color="blue">
                {t("common.dashboard.countryContextSection.whoWorldMalariaReport")}
            </a>
        </React.Fragment>
    );
};

export default CountryContextSource;
