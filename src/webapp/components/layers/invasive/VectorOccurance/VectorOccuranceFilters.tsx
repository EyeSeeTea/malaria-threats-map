import React from "react";
import YearRangeSelector from "../../../YearRangeSelector";
import VectorSpeciesFilter from "../../../filters/VectorSpeciesFilter";
import { Snackbar } from "../../../filters/container/Filters";
import { Link } from "@material-ui/core";
import { Trans, useTranslation } from "react-i18next";

export default function VectorOccuranceFilters() {
    const { t } = useTranslation();
    return (
        <>
            <VectorSpeciesFilter />
            <YearRangeSelector minYear={1985} maxYear={new Date().getFullYear()} />
            <Snackbar>
                <Trans i18nKey="common.invasive.legend.vector_occurrance.link_content_1">
                    If you have detected invasive <i>Anopheles</i> vector species please report to us through the
                </Trans>
                <Link href={t("common.invasive.legend.vector_occurrance.link")} target="_blank">
                    {t("common.invasive.legend.vector_occurrance.link_text")}
                </Link>
            </Snackbar>
        </>
    );
}
