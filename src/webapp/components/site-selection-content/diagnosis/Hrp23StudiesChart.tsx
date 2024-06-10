import * as React from "react";
import { Table, TableCell, TableRow, Divider, TableBody, Paper } from "@mui/material";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { DiagnosisSelectionData, HRP23_STUDIES, Hrp23StudyDetails } from "../../../store/epics/diagnosis/types";
import { Hrp23StudiesColors } from "../../layers/diagnosis/Hrp23Studies/symbols";

type Hrp23StudiesChartProps = {
    selectionData: DiagnosisSelectionData;
};

const Hrp23StudiesChart = ({ selectionData }: Hrp23StudiesChartProps) => {
    const { t } = useTranslation();

    const data: Hrp23StudyDetails[] = React.useMemo(() => {
        if (
            selectionData.kind === "diagnosis" &&
            (selectionData.data.kind === "gene-deletions" || selectionData.data.kind === "hrp23-studies")
        ) {
            return selectionData.data.data as Hrp23StudyDetails[];
        } else {
            return null;
        }
    }, [selectionData]);

    return (
        <Container>
            {data.map((studyDetails, index) => (
                <React.Fragment key={`HRP23_study_${index}`}>
                    <RoundedContainer $isLast={index === data.length - 1} $isFirst={index === 0}>
                        <Table>
                            <TableBody>
                                {Object.entries(studyDetails).map(([key, { label, value }], index) => (
                                    <TableRow key={`HRP23_study_${index}_${key}`}>
                                        <StyledTableHeader
                                            variant="head"
                                            $noShadow={index === Object.values(studyDetails).length - 1}
                                        >
                                            {label}
                                        </StyledTableHeader>
                                        <StyledTableCell $noShadow={index === Object.values(studyDetails).length - 1}>
                                            <StyledStatusWrapper>
                                                {key === HRP23_STUDIES.STATUS ? (
                                                    <>
                                                        <StatusSymbol
                                                            color={Hrp23StudiesColors[value][0]}
                                                            borderColor={Hrp23StudiesColors[value][1]}
                                                        />
                                                        {t(
                                                            `common.diagnosis.chart.hrp23_studies.${value.toLowerCase()}`
                                                        )}
                                                    </>
                                                ) : key === HRP23_STUDIES.GENOTYPING ? (
                                                    value === "Not specified" ? (
                                                        value
                                                    ) : (
                                                        <i>{value}</i>
                                                    )
                                                ) : (
                                                    value
                                                )}
                                            </StyledStatusWrapper>
                                        </StyledTableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </RoundedContainer>

                    {index === data.length - 1 ? null : <StyledDivider />}
                </React.Fragment>
            ))}
        </Container>
    );
};

export default Hrp23StudiesChart;

const Container = styled.div`
    margin: 15px 9px;
`;

const RoundedContainer = styled(Paper)<{ $isFirst?: boolean; $isLast?: boolean }>`
    padding: 20px;
    display: flex;
    flex-direction: column;
    font-size: 12px;
    border-top-left-radius: ${props => (props.$isFirst ? "10px" : "unset")};
    border-top-right-radius: ${props => (props.$isFirst ? "10px" : "unset")};
    border-bottom-right-radius: ${props => (props.$isLast ? "10px" : "unset")};
    border-bottom-left-radius: ${props => (props.$isLast ? "10px" : "unset")};
    box-shadow: none;
    padding-bottom: ${props => props.$isLast && "46px"};
`;

const StyledTableHeader = styled(TableCell)<{ $noShadow?: boolean }>`
    background-color: #f5f5f5;
    color: #343434;
    padding: 7px;
    font-size: 12px;
    border-bottom: none;
    box-shadow: ${props => (props.$noShadow ? "none" : "inset 0px -1px 0px #cccccc")};
    width: 145px;
`;

const StyledTableCell = styled(TableCell)<{ $noShadow: boolean }>`
    color: #343434;
    padding: 7px;
    font-size: 12px;
    border-bottom: none;
    box-shadow: ${props => (props.$noShadow ? "none" : "inset 0px -1px 0px #cccccc")};
`;

const StyledStatusWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
`;

const StatusSymbol = styled.div<{ color?: string; borderColor?: string }>`
    border-radius: 50%;
    width: 12px;
    height: 12px;
    border-color: ${props => props.borderColor ?? "#adadad"};
    background-color: ${props => props.color ?? "#d3d3d3"};
`;

const StyledDivider = styled(Divider)`
    border-color: #00000033;
`;
