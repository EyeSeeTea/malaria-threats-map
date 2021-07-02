import { Link, Typography } from "@material-ui/core";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { logOutboundLinkAction } from "../../store/actions/base-actions";
import { connect } from "react-redux";
import { Study } from "../../../domain/entities/Study";
import { useState } from "react";
import { useEffect } from "react";
import styled from "styled-components";
import _ from "lodash";

const CitationUl = styled.div`
    margin: 0px;
`;

const mapDispatchToProps = {
    logOutboundLinkAction: logOutboundLinkAction,
};

type OwnProps = {
    study: Partial<Study>;
    allStudiesGroup?: Partial<Study>[];
};
type DispatchProps = typeof mapDispatchToProps;
type Props = OwnProps & DispatchProps;

export const isNull = (value: string) => value === null || !value || value.trim() === "NA" || value.trim() === "NR";

const valueOrUndefined = (value: string) => (isNull(value) ? undefined : value.trim());

// TODO: Translations
const Citation = ({ study, logOutboundLinkAction, allStudiesGroup }: Props) => {
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
            {!isNull(study.CITATION_URL) ? (
                <Typography variant="caption">
                    <Link onClick={logClick} href={study.CITATION_URL} target="_blank">
                        {valueOrUndefined(study.CITATION_LONG) ||
                            valueOrUndefined(study.CITATION) ||
                            valueOrUndefined(study.INSTITUTION) ||
                            valueOrUndefined(study.CITATION_URL)}
                        {study.INSTITUTION_CITY ? `, ${study.INSTITUTION_CITY}` : ``}
                    </Link>
                </Typography>
            ) : citationLongs.length > 0 ? (
                <CitationUl>
                    {citationLongs.map((citationLong, index) => {
                        return (
                            <li key={index}>
                                <Typography variant="caption">{citationLong}</Typography>
                            </li>
                        );
                    })}
                </CitationUl>
            ) : institutes.length > 0 ? (
                <CitationUl>
                    {institutes.map((institute, index) => {
                        return (
                            <li key={index}>
                                <Typography variant="caption">{institute}</Typography>
                            </li>
                        );
                    })}
                </CitationUl>
            ) : (
                <Typography variant="caption">{t("common.citation.unpublished_data")}</Typography>
            )}
        </>
    );
};

export default connect(null, mapDispatchToProps)(Citation);
