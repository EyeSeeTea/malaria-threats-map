import { Link, List, ListItem, Typography } from "@mui/material";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { logOutboundLinkAction } from "../../store/actions/base-actions";
import { connect } from "react-redux";
import styled from "styled-components";
import { CitationDataSource } from "../../store/SelectionData";

const mapDispatchToProps = {
    logOutboundLinkAction: logOutboundLinkAction,
};

type DispatchProps = typeof mapDispatchToProps;
type OwnProps = {
    dataSources: CitationDataSource[];
};
type Props = DispatchProps & OwnProps;

const Container = styled.div`
    margin: 0px;
`;

const StyledListItem = styled(ListItem)`
    padding: 0px 0px 2px 0px;
`;

const CitationNew = ({ dataSources, logOutboundLinkAction }: Props) => {
    const { t } = useTranslation();
    const logClick = React.useCallback((url: string) => logOutboundLinkAction(url), [logOutboundLinkAction]);

    return (
        <Container>
            <Typography variant="caption" display={"block"}>
                <b>{t("common.citation.data_source")}</b>
            </Typography>
            {dataSources.length > 0 ? (
                <List>
                    {dataSources.map(dataSource => {
                        return (
                            <StyledListItem key={dataSource.key}>
                                <Typography variant="caption">
                                    {dataSource.url ? (
                                        <span>
                                            {`(${dataSource.key}) `}
                                            <Link
                                                onClick={() => logClick(dataSource.url)}
                                                href={dataSource.url}
                                                target="_blank"
                                            >
                                                {dataSource.text}
                                            </Link>
                                        </span>
                                    ) : (
                                        `(${dataSource.key}) ${dataSource.text}`
                                    )}
                                </Typography>
                            </StyledListItem>
                        );
                    })}
                </List>
            ) : (
                <Typography variant="caption">{t("common.citation.source_not_provided")}</Typography>
            )}
        </Container>
    );
};

export default connect(null, mapDispatchToProps)(CitationNew);
