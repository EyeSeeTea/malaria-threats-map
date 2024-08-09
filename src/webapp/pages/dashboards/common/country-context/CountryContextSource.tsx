import { Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { DataSourceInfo } from "./context/useCountryContextData";

type CountryContextSourceProps = {
    sourceInfo: DataSourceInfo[];
};

const CountryContextSource: React.FC<CountryContextSourceProps> = props => {
    const { sourceInfo } = props;
    const { t } = useTranslation();

    return (
        <Container>
            <Typography variant="body2" display="inline">
                {t("common.dashboard.countryContextDashboards.source")}&nbsp;
            </Typography>
            <Container gap={12}>
                {sourceInfo.map(source => (
                    <Container key={`${source.name}-${source.year}`}>
                        {source.link ? (
                            <a href={source.link} color="blue" target={"_blank"} rel="noreferrer">
                                <Typography variant="body2" display="inline">
                                    {source.name}
                                </Typography>
                            </a>
                        ) : (
                            <Typography variant="body2" display="inline">
                                {source.name}
                            </Typography>
                        )}
                    </Container>
                ))}
            </Container>
        </Container>
    );
};

export default CountryContextSource;

const Container = styled.div<{ gap?: number }>`
    display: flex;
    gap: ${props => props.gap ?? 4}px;
`;
