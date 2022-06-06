import * as React from "react";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { AditionalInformation } from "../../../../store/SelectionData";

const Margin = styled.div`
    margin-bottom: 10px;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 0px;
    padding: 0px;
`;

type OwnProps = {
    info: AditionalInformation[];
};

type Props = OwnProps;

const AditionalInformationContent = ({ info }: Props) => {
    const { t } = useTranslation();

    return (
        <Margin>
            <Typography variant="caption" display="block" sx={{ marginBottom: 2 }}>
                <b>{t("common.treatment.chart.treatment_failure.aditional_information_title")}</b>
            </Typography>

            {info && (
                <div>
                    {info.map(item => {
                        return (
                            <Row key={item.year}>
                                <Typography variant="caption" display="block">
                                    <b>{`${item.year}.`}&nbsp;&nbsp;</b>
                                </Typography>

                                <Typography variant="caption" display="block">
                                    <span>
                                        {item.text}
                                        {`${item.conducted.label} :`}
                                        {item.conducted.link ? (
                                            <a href={item.conducted.link}>{item.conducted.text}</a>
                                        ) : (
                                            <span>{item.conducted.text}</span>
                                        )}
                                    </span>
                                </Typography>
                            </Row>
                        );
                    })}
                </div>
            )}
        </Margin>
    );
};

export default AditionalInformationContent;
