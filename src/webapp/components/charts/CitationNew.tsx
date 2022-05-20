import { Link, Typography } from "@mui/material";
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
import { isNull, isNotNull } from "../../utils/number-utils";
import styled from "styled-components";

const mapDispatchToProps = {
    logOutboundLinkAction: logOutboundLinkAction,
};

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
});
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = {
    studies: Study[];
};
type Props = DispatchProps & StateProps & OwnProps;

const valueOrUndefined = (value: string) => (isNull(value) ? undefined : value.trim());

const CitationUl = styled.div`
    margin: 0px;
`;

const CitationNew = ({ studies, logOutboundLinkAction, theme }: Props) => {
    const { t } = useTranslation();
    const logClick = React.useCallback(
        (study: Study) => {
            logOutboundLinkAction(study.CITATION_URL);
        },
        [logOutboundLinkAction]
    );

    const [studiesWithUrl, setStudiesWithUrl] = useState<Study[]>([]);
    const [citationsOrInstitutes, setCitationsOrInstitutes] = useState<string[]>([]);
    const [institutions, setInstitutions] = useState<string[]>([]);

    useEffect(() => {
        const studiesWithURL = studies.filter(study => isNotNull(study.CITATION_URL));
        const studiesWithoutURL = studies.filter(study => isNull(study.CITATION_URL));

        setStudiesWithUrl(_.uniqBy(studiesWithURL, study => study.CITATION_URL));

        const citations = _.uniq(
            studiesWithoutURL.filter(study => isNotNull(study.CITATION_LONG)).map(study => study.CITATION_LONG)
        );
        const institutes = _.uniq(
            studiesWithoutURL.filter(study => isNotNull(study.INSTITUTE)).map(study => study.INSTITUTE)
        );

        setCitationsOrInstitutes(citations.length > 0 ? citations : institutes);
        setInstitutions(
            _.uniq(studiesWithoutURL.filter(study => isNotNull(study.INSTITUTION)).map(study => study.INSTITUTION))
        );

        // } else {
        //     if (theme === "invasive") {
        //         setCitations(study.CITATION ? [study.CITATION] : []);
        //     } else {
        //         setCitations(study.CITATION_LONG ? [study.CITATION_LONG] : []);
        //     }

        //     setInstitutes(study.INSTITUTE ? [study.INSTITUTE] : []);
        // }
    }, [studies, theme]);

    console.log({ studiesWithUrl });

    console.log({ citationsOrInstitutes });
    console.log({ institutions });

    return (
        <CitationUl>
            <Typography variant="caption">
                <b>{t("common.citation.data_source")}</b>
            </Typography>
            {studiesWithUrl.length > 0 &&
                studiesWithUrl.map(study => {
                    return (
                        <li key={study.OBJECTID}>
                            {
                                <Typography variant="caption">
                                    <Link onClick={() => logClick(study)} href={study.CITATION_URL} target="_blank">
                                        {valueOrUndefined(study.CITATION_LONG) ||
                                            valueOrUndefined(study.CITATION) ||
                                            valueOrUndefined(study.INSTITUTION) ||
                                            valueOrUndefined(study.CITATION_URL)}
                                        {study.INSTITUTION_CITY ? `, ${study.INSTITUTION_CITY}` : ``}
                                    </Link>
                                </Typography>
                            }
                        </li>
                    );
                })}
            {theme !== "treatment" &&
                citationsOrInstitutes.length !== 0 &&
                citationsOrInstitutes.map(dataSource => {
                    return (
                        <li key={dataSource}>
                            <Typography variant="caption">{dataSource}</Typography>
                        </li>
                    );
                })}
            {theme === "treatment" &&
                institutions.length !== 0 &&
                institutions.map(institution => {
                    return (
                        <li key={institution}>
                            <Typography variant="caption">{institution}</Typography>
                        </li>
                    );
                })}
            {studiesWithUrl.length === 0 && citationsOrInstitutes.length === 0 && institutions.length === 0 && (
                <Typography variant="caption">{t("common.citation.source_not_provided")}</Typography>
            )}
        </CitationUl>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(CitationNew);
