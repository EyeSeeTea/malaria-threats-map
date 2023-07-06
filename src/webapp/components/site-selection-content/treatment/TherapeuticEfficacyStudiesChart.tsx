import * as React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Table, TableCell, TableRow, Typography, Divider, Paper, TableBody } from "@mui/material";

import { Study } from "../../../../domain/entities/Study";
import { getTherapeuticEfficacyStudiesStatusFromStatusId } from "../../layers/treatment/TherapeuticEfficacyStudies/utils";
import { TherapeuticEfficacyStudiesColors } from "../../layers/treatment/TherapeuticEfficacyStudies/therapeuticEfficacyStudiesSymbols";
import { TreatmentStudy } from "../../../../domain/entities/TreatmentStudy";
import { PLASMODIUM_SPECIES_SUGGESTIONS } from "../../filters/PlasmodiumSpeciesFilter";

enum OVERVIEW_INFO_KEYS {
    STATUS = "status",
    PROPOSED_TIMEFRAME = "proposedTimeframe",
    LEAD_INSTITUTION = "leadInstitution",
    FUNDING_SOURCE = "fundingSource",
}

type OverviewInfo = {
    [K in OVERVIEW_INFO_KEYS]: {
        label: string;
        value: string;
    };
};

enum STUDY_DETAILS_KEYS {
    AGE_GROUP = "ageGroup",
    SPECIES = "species",
    DRUG = "drug",
    GENOTYPING = "genotyping",
}

type StudyDetails = {
    [K in STUDY_DETAILS_KEYS]: {
        label: string;
        value: string;
    };
};

type StudyDetailsConfig = {
    title: string;
    config: StudyDetails;
};

type TherapeuticEfficacyStudiesChartProps = {
    studyObject: Study;
    data: TreatmentStudy[];
};

const TherapeuticEfficacyStudiesChart = ({ studyObject, data }: TherapeuticEfficacyStudiesChartProps) => {
    const { t } = useTranslation();

    const overviewTableConfig: OverviewInfo = React.useMemo(() => {
        const status = getTherapeuticEfficacyStudiesStatusFromStatusId(studyObject.SURV_STATUS);
        return {
            [OVERVIEW_INFO_KEYS.STATUS]: {
                label: t(`common.treatment.chart.therapeutic_efficacy_studies.status`),
                value: status,
            },
            [OVERVIEW_INFO_KEYS.PROPOSED_TIMEFRAME]: {
                label: t(`common.treatment.chart.therapeutic_efficacy_studies.proposed_timeframe`),
                value: `${studyObject.YEAR_START} - ${studyObject.YEAR_END}`,
            },
            [OVERVIEW_INFO_KEYS.LEAD_INSTITUTION]: {
                label: t(`common.treatment.chart.therapeutic_efficacy_studies.lead_institution`),
                value: studyObject.INSTITUTION,
            },
            [OVERVIEW_INFO_KEYS.FUNDING_SOURCE]: {
                label: t(`common.treatment.chart.therapeutic_efficacy_studies.funding_source`),
                value: studyObject.FUNDING_SOURCE,
            },
        };
    }, [
        studyObject.FUNDING_SOURCE,
        studyObject.INSTITUTION,
        studyObject.SURV_STATUS,
        studyObject.YEAR_END,
        studyObject.YEAR_START,
        t,
    ]);

    const studyDetailsTablesConfig: StudyDetailsConfig[] = React.useMemo(() => {
        return data.map(item => ({
            title: t(`common.treatment.chart.therapeutic_efficacy_studies.study_details`, {
                number: item.STUDY_SEQ,
                count: data.length,
            }),
            config: {
                [STUDY_DETAILS_KEYS.AGE_GROUP]: {
                    label: t(`common.treatment.chart.therapeutic_efficacy_studies.age_group`),
                    value: item.AGE_GP,
                },
                [STUDY_DETAILS_KEYS.SPECIES]: {
                    label: t(`common.treatment.chart.therapeutic_efficacy_studies.species`),
                    value:
                        PLASMODIUM_SPECIES_SUGGESTIONS.find(species => species.value === item.PLASMODIUM_SPECIES)
                            ?.label || item.PLASMODIUM_SPECIES,
                },
                [STUDY_DETAILS_KEYS.DRUG]: {
                    label: t(`common.treatment.chart.therapeutic_efficacy_studies.drug`),
                    value: t(item.DRUG_NAME),
                },
                [STUDY_DETAILS_KEYS.GENOTYPING]: {
                    label: t(`common.treatment.chart.therapeutic_efficacy_studies.genotyping`),
                    value: item.MM_LIST,
                },
            },
        }));
    }, [data, t]);

    return (
        <Container>
            <RoundedContainer $isFirst>
                <StyledTypography>{t(`common.treatment.chart.therapeutic_efficacy_studies.overview`)}</StyledTypography>
                <Table>
                    <TableBody>
                        {Object.entries(overviewTableConfig).map(([key, { label, value }], index) => (
                            <TableRow key={key}>
                                <StyledTableHeader
                                    variant="head"
                                    $noShadow={index === Object.values(overviewTableConfig).length - 1}
                                >
                                    {label}
                                </StyledTableHeader>
                                <StyledTableCell $noShadow={index === Object.values(overviewTableConfig).length - 1}>
                                    <StyledWrapper>
                                        {key === OVERVIEW_INFO_KEYS.STATUS ? (
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
            {studyDetailsTablesConfig.map(({ title, config: studyDetailsConfig }, index) => (
                <React.Fragment key={title}>
                    <RoundedContainer $isLast={index === studyDetailsTablesConfig.length - 1}>
                        <StyledTypography>{title}</StyledTypography>
                        <Table>
                            <TableBody>
                                {Object.entries(studyDetailsConfig).map(([key, { label, value }], index) => (
                                    <TableRow key={key}>
                                        <StyledTableHeader
                                            variant="head"
                                            $noShadow={index === Object.keys(studyDetailsConfig).length - 1}
                                        >
                                            {label}
                                        </StyledTableHeader>
                                        <StyledTableCell
                                            $noShadow={index === Object.keys(studyDetailsConfig).length - 1}
                                        >
                                            {key === STUDY_DETAILS_KEYS.SPECIES ? <i>{value}</i> : value}
                                        </StyledTableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </RoundedContainer>
                    {index === Object.keys(studyDetailsTablesConfig).length - 1 ? null : <StyledDivider />}
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
