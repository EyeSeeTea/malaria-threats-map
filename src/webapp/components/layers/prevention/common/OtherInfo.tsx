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
    title: string;
    info: string[];
};

type Props = OwnProps;

const OtherInfo = ({ title, info }: Props) => {
    const { t } = useTranslation();
    const sortedInfo = info.sort((a, b) => a.localeCompare(b));

    return (
        <Margin>
            <Typography variant="caption">
                <b>{title}</b>
            </Typography>
            <br />

            {sortedInfo.length > 0 ? (
                <Ul>
                    {sortedInfo.map(item => {
                        return (
                            <li key={item}>
                                <Typography variant="caption" display="block">
                                    {item}
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

export default OtherInfo;
