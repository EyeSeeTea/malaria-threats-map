import { Typography } from "@mui/material";
import * as React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { SelectionData } from "../../../store/types";

const Container = styled.div`
    margin-bottom: 16px;
`;

const Row = styled.div`
    margin-bottom: 8px;
`;

type Props = {
    selectionData: SelectionData;
};

const InvasiveChart: React.FC<Props> = ({ selectionData }) => {
    const { t } = useTranslation();

    const data = React.useMemo(() => {
        if (selectionData.data.kind === "invasive") {
            return selectionData.data.data;
        } else {
            return null;
        }
    }, [selectionData]);

    return (
        <Container>
            {data.species && (
                <Row>
                    <Typography variant="body2">
                        <b>{t("common.invasive.chart.vector_occurrance.species")}:&nbsp;</b>
                        {data.species}
                    </Typography>
                </Row>
            )}
            {data.samplingPeriod && (
                <Row>
                    <Typography variant="body2">
                        <b>{t("common.invasive.chart.vector_occurrance.sampling_period")}:&nbsp;</b>
                        {data.samplingPeriod}
                    </Typography>
                </Row>
            )}
            {data.samplingMethod && (
                <Row>
                    <Typography variant="body2">
                        <b>{t("common.invasive.chart.vector_occurrance.sampling_method")}:&nbsp;</b>
                        {data.samplingMethod}
                    </Typography>
                </Row>
            )}
            {data.speciedIdentificationMethod && (
                <Row>
                    <Typography variant="body2">
                        <b>{t("common.invasive.chart.vector_occurrance.study_identification_method")}:&nbsp;</b>
                        {data.speciedIdentificationMethod}
                    </Typography>
                </Row>
            )}
            {data.vectorStage && (
                <Row>
                    <Typography variant="body2">
                        <b>{"Vector Stage"}:&nbsp;</b>
                        {data.vectorStage}
                    </Typography>
                </Row>
            )}
        </Container>
    );
};

export default InvasiveChart;
