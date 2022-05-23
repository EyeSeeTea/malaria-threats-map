import * as React from "react";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const Margin = styled.div`
    margin-bottom: 10px;
`;

type OwnProps = {
    otherInsecticideClasses: string[];
};

type Props = OwnProps;

const OtherInsecticideClasses = ({ otherInsecticideClasses }: Props) => {
    const { t } = useTranslation();

    return (
        <Margin>
            <Typography variant="caption">
                <b>{t("common.prevention.chart.other_insecticide_class_label")}</b>
            </Typography>
            <br />
            {otherInsecticideClasses.length > 0 ? (
                otherInsecticideClasses.map(insecticideclass => {
                    return (
                        <Typography key={insecticideclass} variant="caption" display="block">
                            {t(insecticideclass)}
                        </Typography>
                    );
                })
            ) : (
                <Typography variant="caption">{t("common.prevention.chart.other_insecticide_class_none")}</Typography>
            )}
        </Margin>
    );
};

export default OtherInsecticideClasses;
