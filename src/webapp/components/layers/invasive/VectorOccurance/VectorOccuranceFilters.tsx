import React from "react";
import YearRangeSelector from "../../../YearRangeSelector";
import VectorSpeciesFilter from "../../../filters/VectorSpeciesFilter";
import { Link } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Snackbar } from "../../common/Snackbar";

export default function VectorOccuranceFilters() {
    const { t } = useTranslation();
    return (
        <>
            <VectorSpeciesFilter />
            <YearRangeSelector minYear={1985} maxYear={new Date().getFullYear()} />
            <Snackbar>
                {t("common.invasive.legend.vector_occurrance.link_content_1")}
                <Link href={t("common.invasive.legend.vector_occurrance.link")} target="_blank">
                    {t("common.invasive.legend.vector_occurrance.link_text")}
                </Link>
            </Snackbar>
        </>
    );
}
