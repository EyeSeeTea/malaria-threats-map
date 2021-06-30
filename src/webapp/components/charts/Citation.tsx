import { Link, Typography } from "@material-ui/core";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { logOutboundLinkAction } from "../../store/actions/base-actions";
import { connect } from "react-redux";
import { Study } from "../../../domain/entities/Study";

const mapDispatchToProps = {
    logOutboundLinkAction: logOutboundLinkAction,
};

type OwnProps = {
    study: Partial<Study>;
};
type DispatchProps = typeof mapDispatchToProps;
type Props = OwnProps & DispatchProps;

const isNull = (value: string) => value === null || !value || value.trim() === "NA" || value.trim() === "NR";

const valueOrUndefined = (value: string) => (isNull(value) ? undefined : value.trim());

// TODO: Translations
const Citation = ({ study, logOutboundLinkAction }: Props) => {
    const { t } = useTranslation();
    const logClick = React.useCallback(() => {
        logOutboundLinkAction(study.CITATION_URL);
    }, [study, logOutboundLinkAction]);
    return !isNull(study.CITATION_URL) ? (
        <>
            <Typography variant="caption">
                <Link onClick={logClick} href={study.CITATION_URL} target="_blank">
                    {valueOrUndefined(study.CITATION_LONG) ||
                        valueOrUndefined(study.CITATION) ||
                        valueOrUndefined(study.INSTITUTION) ||
                        valueOrUndefined(study.CITATION_URL)}
                    {study.INSTITUTION_CITY ? `, ${study.INSTITUTION_CITY}` : ``}
                </Link>
            </Typography>
        </>
    ) : !isNull(study.CITATION_LONG) ? (
        <Typography variant="caption">{study.CITATION_LONG}</Typography>
    ) : !isNull(study.INSTITUTE) ? (
        <Typography variant="caption">{study.INSTITUTE}</Typography>
    ) : (
        <Typography variant="caption">{t("common.citation.unpublished_data")}</Typography>
    );
};

export default connect(null, mapDispatchToProps)(Citation);
