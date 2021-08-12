import * as React from "react";
import { Link,Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import styled from "styled-components";
import { isNull } from "./Citation";

const CitationUl = styled.div`
    margin: 0px;
`;

type Props = {
    dataSources: string[];
    url?: string | null;
};

const CitationDataSources = ({ dataSources, url }: Props) => {
    const { t } = useTranslation();
    return (
        <CitationUl>
            <Typography variant="caption">
                <b>{t("common.citation.data_source")}</b>
            </Typography>
            {dataSources.map((dataSource, index) => {
                return (
                    <li key={index}>
                        {!isNull(url) ? 
                        <Link href={url} target="_blank">
                        <Typography variant="caption">{dataSource}</Typography>
                    </Link>
                        : <Typography variant="caption">{dataSource}</Typography>}
                        
                    </li>
                );
            })}
        </CitationUl>
    );
};

export default connect()(CitationDataSources);
