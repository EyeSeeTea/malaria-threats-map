import React from "react";
import YearRangeSelector from "../../../YearRangeSelector";
import VectorSpeciesFilter from "../../../filters/VectorSpeciesFilter";
import { Snackbar } from "../../../Filters";
import { Link } from "@material-ui/core";
import { useTranslation } from "react-i18next";

export default function VectorOccuranceFilters() {
  const { t } = useTranslation("common");
  return (
    <>
      <VectorSpeciesFilter />
      <YearRangeSelector />
      <Snackbar>
        {t("invasive.legend.vector_occurrance.link_content_1")}
        <Link
          href={t("prevention.legend.vector_ocurrence.link")}
          target="_blank"
        >
          {t("invasive.legend.vector_occurrance.link_text")}
        </Link>
      </Snackbar>
    </>
  );
}
