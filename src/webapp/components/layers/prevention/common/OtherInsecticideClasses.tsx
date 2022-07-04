import * as React from "react";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const Margin = styled.div`
    margin-bottom: 10px;
`;

const Ul = styled.ul`
    margin: 0px;
    padding: 10px;
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
                <Ul>
                    {otherInsecticideClasses.map(insecticideclass => {
                        return (
                            <li key={insecticideclass}>
                                <Typography variant="caption" display="block">
                                    {t(insecticideclass)}
                                </Typography>
                            </li>
                        );
                    })}
                </Ul>
            ) : (
                <Typography variant="caption">{t("common.prevention.chart.other_insecticide_class_none")}</Typography>
            )}
        </Margin>
    );
};

export default OtherInsecticideClasses;
