import { Link, Typography } from "@material-ui/core";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { logOutboundLinkAction } from "../../store/actions/base-actions";
import { connect } from "react-redux";
import { Study } from "../../../domain/entities/Study";
import { selectTheme } from "../../store/reducers/base-reducer";
import { State } from "../../store/types";
import { useState } from "react";
import { useEffect } from "react";
import _ from "lodash";
import CitationDataSources from "./CitationDataSources";
import { isNull, isNotNull } from "../../utils/number-utils";

const mapDispatchToProps = {
    logOutboundLinkAction: logOutboundLinkAction,
};

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
});
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = {
    study: Partial<Study>;
    allStudiesGroup?: Partial<Study>[];
};
type Props = DispatchProps & StateProps & OwnProps;

const valueOrUndefined = (value: string) => (isNull(value) ? undefined : value.trim());

// TODO: Translations
const Citation = ({ study, logOutboundLinkAction, allStudiesGroup, theme }: Props) => {
    const { t } = useTranslation();
    const logClick = React.useCallback(() => {
        logOutboundLinkAction(study.CITATION_URL);
    }, [study, logOutboundLinkAction]);

    const [citations, setCitations] = useState<string[]>([]);
    const [institutes, setInstitutes] = useState<string[]>([]);

    useEffect(() => {
        if (allStudiesGroup) {
            setCitations(
                _.uniq(
                    allStudiesGroup.filter(study => isNotNull(study.CITATION_LONG)).map(study => study.CITATION_LONG)
                )
            );
            setInstitutes(
                _.uniq(allStudiesGroup.filter(study => isNotNull(study.INSTITUTE)).map(study => study.INSTITUTE))
            );
        } else {
            if (theme === "invasive") {
                setCitations(study.CITATION ? [study.CITATION] : []);
            } else {
                setCitations(study.CITATION_LONG ? [study.CITATION_LONG] : []);
            }

            setInstitutes(study.INSTITUTE ? [study.INSTITUTE] : []);
        }
    }, [study, allStudiesGroup, theme]);

    return (
        <>
            {isNotNull(study.CITATION_URL) ? (
                <Typography variant="caption">
                    <Link onClick={logClick} href={study.CITATION_URL} target="_blank">
                        {valueOrUndefined(study.CITATION_LONG) ||
                            valueOrUndefined(study.CITATION) ||
                            valueOrUndefined(study.INSTITUTION) ||
                            valueOrUndefined(study.CITATION_URL)}
                        {study.INSTITUTION_CITY ? `, ${study.INSTITUTION_CITY}` : ``}
                    </Link>
                </Typography>
            ) : citations.length === 1 && theme === "invasive" ? (
                <Typography variant="caption">{citations[0]}</Typography>
            ) : citations.length > 0 && theme !== "treatment" ? (
                <CitationDataSources dataSources={citations} />
            ) : institutes.length > 0 && theme !== "treatment" ? (
                <CitationDataSources dataSources={institutes} />
            ) : isNotNull(study.INSTITUTION) && theme === "treatment" ? (
                <Typography variant="caption">{study.INSTITUTION}</Typography>
            ) : (
                <Typography variant="caption">{t("common.citation.source_not_provided")}</Typography>
            )}
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Citation);
