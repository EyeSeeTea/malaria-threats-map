import * as React from "react";
import { Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import styled from "styled-components";

const CitationUl = styled.div`
    margin: 0px;
`;

type Props = {
    dataSources: string[];
};

const CitationDataSources = ({ dataSources }: Props) => {
    const { t } = useTranslation();
    return (
        <CitationUl>
            <Typography variant="caption">
                <b>{t("common.citation.data_source")}</b>
            </Typography>
            {dataSources.map((dataSource, index) => {
                return (
                    <li key={index}>
                        <Typography variant="caption">{dataSource}</Typography>
                    </li>
                );
            })}
        </CitationUl>
    );
};

export default connect()(CitationDataSources);
