import * as React from "react";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const Margin = styled.div`
    margin-top: 10px;
    margin-bottom: 10px;
`;

type OwnProps = {
    curations: string[];
};

type Props = OwnProps;

const CurationNew = ({ curations }: Props) => {
    const { t } = useTranslation();
    return (
        <Margin>
            <Typography variant="caption">
                <b>{t("common.invasive.chart.vector_occurrance.data_collection")}</b>
            </Typography>
            <br />
            {curations.length > 0 &&
                curations.map(curation => {
                    return (
                        <Typography key={curation} variant="caption" display="block">
                            {curation}
                        </Typography>
                    );
                })}
        </Margin>
    );
};

export default CurationNew;
