import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import * as React from "react";
import { Trans, useTranslation } from "react-i18next";
import styled from "styled-components";
import { DiagnosisSelectionData, GeneDeletionsChartDataContent } from "../../../store/epics/diagnosis/types";
import { isNotNull } from "../../../utils/number-utils";
import { DiagnosisStudy } from "../../../../domain/entities/DiagnosisStudy";

// const SpacedTypography = styled(Typography)`
//     margin-bottom: 5px;
// `;

const StyledTableHead = styled(TableHead)`
    background: #f5f5f5;
    font-size: 12px;
`;

const HeadCell = styled(TableCell)`
    font-size: 12px;
    line-height: 16px;
`;

const StyledTypography = styled(Typography)`
    font-weight: bold;
`;

const HeaderContainer = styled.span`
    padding: 12px 0px;
`;

const DataSourceTypography = styled(Typography)`
    color: grey;
`;

const StyledTable = styled(Table)`
    margin-bottom: 16px;
`;

const SpacedTypography = styled(Typography)`
    margin-bottom: 5px;
`;

type Props = {
    selectionData: DiagnosisSelectionData;
};

const GeneDeletionsChart: React.FC<Props> = ({ selectionData }) => {
    const { t } = useTranslation();

    const data: GeneDeletionsChartDataContent[] = React.useMemo(() => {
        if (
            selectionData.kind === "diagnosis" &&
            (selectionData.data.kind === "gene-deletions" || selectionData.data.kind === "hrp23-studies")
        ) {
            return selectionData.data.data as GeneDeletionsChartDataContent[];
        } else {
            return null;
        }
    }, [selectionData]);

    const study = React.useMemo(() => selectionData.studyObject as DiagnosisStudy, [selectionData]);

    return (
        <React.Fragment>
            {isNotNull(study.SAMPLE_ORIGIN) && (
                <SpacedTypography variant="subtitle2">{t(study.SAMPLE_ORIGIN)}</SpacedTypography>
            )}
            {study.PF_POS_SAMPLES && (
                <SpacedTypography variant="subtitle2">
                    <Trans
                        i18nKey="common.diagnosis.chart.gene_deletions.content_3"
                        values={{ pfPosSamples: study.PF_POS_SAMPLES }}
                        t={t}
                    >
                        Number of <i>P. falciparum</i> positive samples from the study population:
                    </Trans>
                </SpacedTypography>
            )}
            {isNotNull(study.TYPE_SAMPL_ANALYZED) && (
                <SpacedTypography variant="subtitle2">
                    {t("common.diagnosis.chart.gene_deletions.content_4", {
                        typeSampleAnalyzed: t(study.TYPE_SAMPL_ANALYZED),
                    })}
                </SpacedTypography>
            )}

            {data
                .sort((a, b) => a.year - b.year)
                .map(yearData => {
                    return (
                        <>
                            {yearData.header && (
                                <HeaderContainer>
                                    <StyledTypography variant="caption">{`${yearData.header} `}</StyledTypography>
                                    <DataSourceTypography variant="caption">
                                        {yearData.dataSources}
                                    </DataSourceTypography>
                                </HeaderContainer>
                            )}
                            <StyledTable aria-label="simple table" size="small">
                                <StyledTableHead>
                                    <TableRow>
                                        <HeadCell align={"center"}>
                                            {t("common.diagnosis.chart.gene_deletions.deletion_type")}
                                        </HeadCell>
                                        <HeadCell align={"center"}>
                                            {t("common.diagnosis.chart.gene_deletions.no_tested")}
                                        </HeadCell>
                                        <HeadCell align={"center"}>
                                            {t("common.diagnosis.chart.gene_deletions.percentage")}
                                        </HeadCell>
                                    </TableRow>
                                </StyledTableHead>
                                <TableBody>
                                    {yearData.items.map((row, index) => {
                                        return (
                                            <TableRow key={index}>
                                                <TableCell align={"center"}>{row.type}</TableCell>
                                                <TableCell align={"center"}>{row.samples}</TableCell>
                                                <TableCell align={"center"}>{row.percentageConfirmed}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </StyledTable>
                        </>
                    );
                })}
        </React.Fragment>
    );
};

export default GeneDeletionsChart;
