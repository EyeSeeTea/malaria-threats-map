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

export const isNull = (value: string) => value === null || !value || value.trim() === "NA" || value.trim() === "NR";

const valueOrUndefined = (value: string) => (isNull(value) ? undefined : value.trim());

// TODO: Translations
const Citation = ({ study, logOutboundLinkAction, allStudiesGroup, theme }: Props) => {
    const { t } = useTranslation();
    const logClick = React.useCallback(() => {
        logOutboundLinkAction(study.CITATION_URL);
    }, [study, logOutboundLinkAction]);
    const [citationLongs, setCitationLongs] = useState<string[]>([]);
    const [institutes, setInstitutes] = useState<string[]>([]);

    useEffect(() => {
        if (allStudiesGroup) {
            setCitationLongs(
                _.uniq(allStudiesGroup.filter(study => !isNull(study.CITATION_LONG)).map(study => study.CITATION_LONG))
            );
            setInstitutes(
                _.uniq(allStudiesGroup.filter(study => !isNull(study.INSTITUTE)).map(study => study.INSTITUTE))
            );
        } else {
            setCitationLongs([study.CITATION_LONG]);
            setInstitutes([study.INSTITUTE]);
        }
    }, [study, allStudiesGroup]);
    return (
        <>
            {theme !== "prevention" ? (
                <Typography variant="caption">
                    {!isNull(study.CITATION_URL) ? (
                        <Link onClick={logClick} href={study.CITATION_URL} target="_blank">
                            {valueOrUndefined(study.CITATION_LONG) ||
                                valueOrUndefined(study.CITATION) ||
                                valueOrUndefined(study.INSTITUTION) ||
                                valueOrUndefined(study.CITATION_URL)}
                            {study.INSTITUTION_CITY ? `, ${study.INSTITUTION_CITY}` : ``}
                        </Link>
                    ) : (
                        <>
                            {valueOrUndefined(study.CITATION_LONG) ||
                                valueOrUndefined(study.CITATION) ||
                                valueOrUndefined(study.INSTITUTION) ||
                                valueOrUndefined(study.CITATION_URL)}
                            {study.INSTITUTION_CITY ? `, ${study.INSTITUTION_CITY}` : ``}
                        </>
                    )}
                </Typography>
            ) : citationLongs.length > 0 && theme === "prevention" ? (
                <CitationDataSources dataSources={citationLongs} url={study.CITATION_URL} />
            ) : institutes.length > 0 && theme === "prevention" ? (
                <CitationDataSources dataSources={institutes} url={study.CITATION_URL} />
            ) : (
                <Typography variant="caption">{t("common.citation.source_not_provided")}</Typography>
            )}
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Citation);
