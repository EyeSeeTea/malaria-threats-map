import * as React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Table, TableCell, TableRow, Typography, Divider, Paper, TableBody } from "@mui/material";

import {
    SelectionData,
    THERAPEUTIC_EFFICACY_STUDY_DETAILS_KEYS,
    THERAPEUTIC_EFFICACY_STUDY_OVERVIEW_INFO_KEYS,
    TherapeuticEfficacyStudiesDetailsConfig,
    TherapeuticEfficacyStudiesOverviewInfo,
} from "../../../store/SelectionData";
import { TherapeuticEfficacyStudiesColors } from "../../layers/treatment/TherapeuticEfficacyStudies/therapeuticEfficacyStudiesSymbols";

type TherapeuticEfficacyStudiesChartProps = {
    selectionData: SelectionData;
};

const TherapeuticEfficacyStudiesChart = ({ selectionData }: TherapeuticEfficacyStudiesChartProps) => {
    const { t } = useTranslation();

    const studiesDetailsConfig: TherapeuticEfficacyStudiesDetailsConfig[] = React.useMemo(() => {
        if (selectionData.kind === "common" && selectionData.data.kind === "therapeutic-efficacy-studies") {
            return selectionData.data.data.studiesDetailsConfig;
        } else {
            return null;
        }
    }, [selectionData]);

    const overviewInfo: TherapeuticEfficacyStudiesOverviewInfo = React.useMemo(() => {
        if (selectionData.kind === "common" && selectionData.data.kind === "therapeutic-efficacy-studies") {
            return selectionData.data.data.overviewInfo;
        } else {
            return null;
        }
    }, [selectionData]);

    return (
        <Container>
            <RoundedContainer $isFirst>
                <StyledTypography>{t(`common.treatment.chart.therapeutic_efficacy_studies.overview`)}</StyledTypography>
                <Table>
                    <TableBody>
                        {Object.entries(overviewInfo).map(([key, { label, value }], index) => (
                            <TableRow key={key}>
                                <StyledTableHeader
                                    variant="head"
                                    $noShadow={index === Object.values(overviewInfo).length - 1}
                                >
                                    {label}
                                </StyledTableHeader>
                                <StyledTableCell $noShadow={index === Object.values(overviewInfo).length - 1}>
                                    <StyledWrapper>
                                        {key === THERAPEUTIC_EFFICACY_STUDY_OVERVIEW_INFO_KEYS.STATUS ? (
                                            <React.Fragment>
                                                <StatusSymbol
                                                    color={TherapeuticEfficacyStudiesColors[value][0]}
                                                    borderColor={TherapeuticEfficacyStudiesColors[value][1]}
                                                />
                                                {t(
                                                    `common.treatment.chart.therapeutic_efficacy_studies.${value.toLowerCase()}`
                                                )}
                                            </React.Fragment>
                                        ) : (
                                            value
                                        )}
                                    </StyledWrapper>
                                </StyledTableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </RoundedContainer>
            <StyledDivider />
            {studiesDetailsConfig.map(({ title, studyDetails }, index) => (
                <React.Fragment key={title}>
                    <RoundedContainer $isLast={index === studiesDetailsConfig.length - 1}>
                        <StyledTypography>{title}</StyledTypography>
                        <Table>
                            <TableBody>
                                {Object.entries(studyDetails).map(([key, { label, value }], index) => (
                                    <TableRow key={key}>
                                        <StyledTableHeader
                                            variant="head"
                                            $noShadow={index === Object.keys(studyDetails).length - 1}
                                        >
                                            {label}
                                        </StyledTableHeader>
                                        <StyledTableCell $noShadow={index === Object.keys(studyDetails).length - 1}>
                                            {key === THERAPEUTIC_EFFICACY_STUDY_DETAILS_KEYS.SPECIES ? (
                                                <i>{value}</i>
                                            ) : (
                                                value
                                            )}
                                        </StyledTableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </RoundedContainer>
                    {index === studiesDetailsConfig.length - 1 ? null : <StyledDivider />}
                </React.Fragment>
            ))}
        </Container>
    );
};

export default TherapeuticEfficacyStudiesChart;

const RoundedContainer = styled(Paper)<{ $isFirst?: boolean; $isLast?: boolean }>`
    padding: 12px 20px;
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

const Container = styled.div`
    margin: 15px 9px;
`;

const StyledWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
`;

const StyledDivider = styled(Divider)`
    border-color: #00000033;
`;

const StyledTypography = styled(Typography)`
    font-size: 12px;
    color: #343434;
    font-weight: bold;
    margin-bottom: 15px;
`;

const StatusSymbol = styled.div<{ color?: string; borderColor?: string }>`
    border-radius: 50%;
    width: 12px;
    height: 12px;
    border-color: ${props => props.borderColor ?? "#adadad"};
    background-color: ${props => props.color ?? "#d3d3d3"};
`;

const StyledTableHeader = styled(TableCell)<{ $noShadow?: boolean }>`
    background-color: #f5f5f5;
    color: #343434;
    padding: 7px;
    font-size: 12px;
    border-bottom: none;
    box-shadow: ${props => (props.$noShadow ? "none" : "inset 0px -1px 0px #cccccc")};
`;

const StyledTableCell = styled(TableCell)<{ $noShadow: boolean }>`
    color: #343434;
    padding: 7px;
    font-size: 12px;
    border-bottom: none;
    box-shadow: ${props => (props.$noShadow ? "none" : "inset 0px -1px 0px #cccccc")};
`;
