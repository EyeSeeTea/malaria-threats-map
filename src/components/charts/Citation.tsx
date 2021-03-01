import { Link, Typography } from "@material-ui/core";
import * as React from "react";
import { Study } from "../../types/Malaria";
import { useTranslation } from "react-i18next";
import { logOutboundLinkAction } from "../../store/actions/base-actions";
import { connect } from "react-redux";

const mapDispatchToProps = {
  logOutboundLinkAction: logOutboundLinkAction,
};

type OwnProps = {
  study: Partial<Study>;
};
type DispatchProps = typeof mapDispatchToProps;
type Props = OwnProps & DispatchProps;

const isNull = (value: string) =>
  value === null || !value || value.trim() === "NA" || value.trim() === "NR";

const valueOrUndefined = (value: string) =>
  isNull(value) ? undefined : value.trim();

// TODO: Translations
const Citation = ({ study, logOutboundLinkAction }: Props) => {
  const { t } = useTranslation("common");
  const logClick = React.useCallback(() => {
    logOutboundLinkAction(study.CITATION_URL);
  }, [study, logOutboundLinkAction])
  return !isNull(study.CITATION_URL) ? (
    <>
      <Typography variant="caption">
        <Link onClick={logClick} href={study.CITATION_URL} target="_blank" color={"textSecondary"}>
          {valueOrUndefined(study.CITATION_LONG) ||
            valueOrUndefined(study.CITATION) ||
            valueOrUndefined(study.INSTITUTION) ||
            valueOrUndefined(study.CITATION_URL)}
          {study.INSTITUTION_CITY ? `, ${study.INSTITUTION_CITY}` : ``}
        </Link>
      </Typography>
    </>
  ) : !isNull(study.CITATION) ? (
    <Typography variant="caption">{study.CITATION}</Typography>
  ) : !isNull(study.INSTITUTION) ? (
    <Typography variant="caption">{study.INSTITUTION}</Typography>
  ) : (
    <Typography variant="caption">{t("citation.no_citation")}</Typography>
  );
};

export default connect(null, mapDispatchToProps)(Citation);
