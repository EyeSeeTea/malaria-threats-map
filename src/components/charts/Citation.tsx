import { Link, Typography } from "@material-ui/core";
import * as React from "react";
import { Study } from "../../types/Malaria";
import { useTranslation } from "react-i18next";

type OwnProps = {
  study: Partial<Study>;
};
type Props = OwnProps;

const isNull = (value: string) =>
  value === null || !value || value.trim() === "NA" || value.trim() === "NR";

const valueOrUndefined = (value: string) =>
  value === null || !value || value.trim() === "NA" || value.trim() === "NR"
    ? undefined
    : value.trim();

// TODO: Translations
const Citation = ({ study }: Props) => {
  const { t } = useTranslation("common");
  return !isNull(study.CITATION_URL) ? (
    <>
      <Typography variant="caption">
        <Link href={study.CITATION_URL} target="_blank" color={"textSecondary"}>
          {valueOrUndefined(study.CITATION_LONG) ||
            valueOrUndefined(study.CITATION) ||
            valueOrUndefined(study.INSTITUTION) ||
            valueOrUndefined(study.CITATION_URL)}
          {study.INSTITUTION_CITY ? `, ${study.INSTITUTION_CITY}` : ``}
        </Link>
      </Typography>
    </>
  ) : !isNull(study.INSTITUTION) ? (
    <Typography variant="caption">{study.INSTITUTION}</Typography>
  ) : (
    <Typography variant="caption">{t("citation.no_citation")}</Typography>
  );
};

export default Citation;
