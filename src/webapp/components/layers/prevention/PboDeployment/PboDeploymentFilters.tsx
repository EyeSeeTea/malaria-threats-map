import React from "react";
import InsecticideTypeFilter from "../../../filters/InsecticideTypeFilter";
import SpeciesFilter from "../../../filters/SpeciesFilter";
import YearRangeSelector from "../../../YearRangeSelector";
import { Snackbar } from "../../../filters/container/Filters";
import { useTranslation } from "react-i18next";
import { Link } from "@mui/material";

export default function PboDeploymentFilters() {
    const { t } = useTranslation();
    return (
        <div>
            <InsecticideTypeFilter />
            <SpeciesFilter />
            <YearRangeSelector minYear={2010} maxYear={new Date().getFullYear()} />
            <Snackbar>
                {t("common.prevention.legend.pbo_deployment.link_content_1")}
                <Link href={t("common.prevention.legend.pbo_deployment.link")} target="_blank">
                    {t("common.prevention.legend.pbo_deployment.link_text")}
                </Link>
                {t("common.prevention.legend.pbo_deployment.link_content_2")}
            </Snackbar>
        </div>
    );
}
