import { Link, Typography } from "@mui/material";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { logOutboundLinkAction } from "../../store/actions/base-actions";
import { connect } from "react-redux";
import styled from "styled-components";
import { CitationDataSource } from "../layers/prevention/ResistanceStatus/ResistanceStatusChart";

const mapDispatchToProps = {
    logOutboundLinkAction: logOutboundLinkAction,
};

type DispatchProps = typeof mapDispatchToProps;
type OwnProps = {
    dataSources: CitationDataSource[];
};
type Props = DispatchProps & OwnProps;

const CitationUl = styled.div`
    margin: 0px;
`;

const CitationNew = ({ dataSources, logOutboundLinkAction }: Props) => {
    const { t } = useTranslation();
    const logClick = React.useCallback((url: string) => logOutboundLinkAction(url), [logOutboundLinkAction]);

    return (
        <CitationUl>
            <Typography variant="caption">
                <b>{t("common.citation.data_source")}</b>
            </Typography>
            {dataSources.length > 0 ? (
                dataSources.map((dataSource, index) => {
                    return (
                        <li key={index}>
                            {
                                <Typography variant="caption">
                                    {dataSource.url ? (
                                        <Link
                                            onClick={() => logClick(dataSource.url)}
                                            href={dataSource.url}
                                            target="_blank"
                                        >
                                            {dataSource.text}
                                        </Link>
                                    ) : (
                                        dataSource.text
                                    )}
                                </Typography>
                            }
                        </li>
                    );
                })
            ) : (
                <Typography variant="caption">{t("common.citation.source_not_provided")}</Typography>
            )}
        </CitationUl>
    );
};

export default connect(null, mapDispatchToProps)(CitationNew);
