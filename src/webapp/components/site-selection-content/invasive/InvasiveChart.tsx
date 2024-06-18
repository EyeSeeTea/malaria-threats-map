import { Paper, Typography } from "@mui/material";
import * as React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { SelectionData } from "../../../store/SelectionData";
import CitationNew from "../../charts/CitationNew";
import CurationNew from "../../charts/CurationNew";

const Row = styled.div`
    margin-bottom: 8px;
`;

type Props = {
    selectionData: SelectionData;
};

const InvasiveChart: React.FC<Props> = ({ selectionData }) => {
    const { t } = useTranslation();

    const data = React.useMemo(() => {
        if (selectionData.kind === "invasive") {
            return selectionData.data;
        } else {
            return null;
        }
    }, [selectionData]);

    return (
        <React.Fragment>
            {data.map(studyData => (
                <RoundedContainer key={studyData.code}>
                    {studyData.species && (
                        <Row>
                            <Typography variant="body2">
                                <b>{t("common.invasive.chart.vector_occurrance.species")}:&nbsp;</b>
                                {studyData.species}
                            </Typography>
                        </Row>
                    )}
                    {studyData.samplingPeriod && (
                        <Row>
                            <Typography variant="body2">
                                <b>{t("common.invasive.chart.vector_occurrance.sampling_period")}:&nbsp;</b>
                                {studyData.samplingPeriod}
                            </Typography>
                        </Row>
                    )}
                    {studyData.samplingMethod && (
                        <Row>
                            <Typography variant="body2">
                                <b>{t("common.invasive.chart.vector_occurrance.sampling_method")}:&nbsp;</b>
                                {studyData.samplingMethod}
                            </Typography>
                        </Row>
                    )}
                    {studyData.speciedIdentificationMethod && (
                        <Row>
                            <Typography variant="body2">
                                <b>{t("common.invasive.chart.vector_occurrance.study_identification_method")}:&nbsp;</b>
                                {studyData.speciedIdentificationMethod}
                            </Typography>
                        </Row>
                    )}
                    {studyData.vectorStage && (
                        <Row>
                            <Typography variant="body2">
                                <b>{t("common.invasive.chart.vector_occurrance.vector_stage")}:&nbsp;</b>
                                {studyData.vectorStage}
                            </Typography>
                        </Row>
                    )}
                    {studyData.larvalHabitat && (
                        <Row>
                            <Typography variant="body2">
                                <b>{t("common.invasive.chart.vector_occurrance.larval_habitat")}:&nbsp;</b>
                                {studyData.larvalHabitat}
                            </Typography>
                        </Row>
                    )}
                    {selectionData.dataSources && <CitationNew dataSources={selectionData.dataSources} />}
                    {selectionData.curations.length > 0 && <CurationNew curations={selectionData.curations} />}
                </RoundedContainer>
            ))}
        </React.Fragment>
    );
};

export default InvasiveChart;

const RoundedContainer = styled(Paper)`
    padding: 12px 20px;
    display: flex;
    flex-direction: column;
    font-size: 12px;
    border-radius: 12px;
    box-shadow: none;
    margin: 0px 8px 16px 8px;
`;
