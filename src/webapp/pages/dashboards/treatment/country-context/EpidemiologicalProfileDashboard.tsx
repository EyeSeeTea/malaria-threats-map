import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { Card, IconButton, Link, Stack, Typography } from "@mui/material";
import styled from "styled-components";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useCountryContextData } from "./context/useCountryContextData";

const numberFormatter = Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

const EpidemiologicalProfileDashboard: React.FC = () => {
    const { t } = useTranslation();

    const { data } = useCountryContextData();

    return (
        <React.Fragment>
            <DasboardCard>
                <Title>{t("common.dashboard.countryContextSection.epidemiologicalProfile.title")}</Title>
                <Table>
                    <thead>
                        <tr>
                            <th>
                                <HeadText>
                                    {t("common.dashboard.countryContextSection.epidemiologicalProfile.country")}
                                </HeadText>
                            </th>
                            <th>
                                <HeadText>
                                    {t("common.dashboard.countryContextSection.epidemiologicalProfile.year")}
                                </HeadText>
                            </th>
                            <th colSpan={3}>
                                <HeadText>
                                    {t("common.dashboard.countryContextSection.epidemiologicalProfile.transmission")}
                                </HeadText>
                            </th>
                            <th colSpan={2}>
                                <HeadText>
                                    {t("common.dashboard.countryContextSection.epidemiologicalProfile.burdenEstimates")}
                                </HeadText>
                            </th>
                        </tr>
                        <tr>
                            <th></th>
                            <th></th>
                            <th>
                                <SubHeadText align="left">
                                    {t(
                                        "common.dashboard.countryContextSection.epidemiologicalProfile.highTransmission"
                                    )}
                                </SubHeadText>
                                <SubHeadText align="left">
                                    {t("common.dashboard.countryContextSection.epidemiologicalProfile.moreThanOneCase")}
                                </SubHeadText>
                            </th>
                            <th>
                                <SubHeadText align="left">
                                    {t("common.dashboard.countryContextSection.epidemiologicalProfile.lowTransmission")}
                                </SubHeadText>
                                <SubHeadText align="left">
                                    {t(
                                        "common.dashboard.countryContextSection.epidemiologicalProfile.lessOrEqualtoOneCase"
                                    )}
                                </SubHeadText>
                            </th>
                            <th>
                                <Stack direction="row">
                                    <Stack direction="column">
                                        <SubHeadText align="left">
                                            {t(
                                                "common.dashboard.countryContextSection.epidemiologicalProfile.malariaFree"
                                            )}
                                        </SubHeadText>
                                        <SubHeadText align="left">
                                            {t(
                                                "common.dashboard.countryContextSection.epidemiologicalProfile.zeroCases"
                                            )}
                                        </SubHeadText>
                                    </Stack>
                                    <IconButton>
                                        <HelpOutlineIcon />
                                    </IconButton>
                                </Stack>
                            </th>
                            <th>
                                <SubHeadText align="left">
                                    {t("common.dashboard.countryContextSection.epidemiologicalProfile.estimatedCases")}
                                </SubHeadText>
                            </th>
                            <th>
                                <SubHeadText align="left">
                                    {t("common.dashboard.countryContextSection.epidemiologicalProfile.estimatedDeaths")}
                                </SubHeadText>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(item => {
                            console.log({ item });
                            return (
                                <tr key={item.ORGANISATIONUNITNAME}>
                                    <td>
                                        <CellText>{item.ORGANISATIONUNITNAME}</CellText>
                                    </td>
                                    <td>
                                        <CellText>{item.PERIOD}</CellText>
                                    </td>
                                    <td>
                                        <CellText>{`${numberFormatter.format(
                                            item.MAL_CALC_POP_AT_RISK_HIGH
                                        )} (?%)`}</CellText>
                                    </td>
                                    <td>
                                        <CellText>{`${numberFormatter.format(
                                            item.MAL_CALC_POP_AT_RISK_LOW_HIGH
                                        )} (?%)`}</CellText>
                                    </td>
                                    <td>
                                        <CellText>{`${numberFormatter.format(item.MAL_POP_UN)} (?%)`}</CellText>
                                    </td>
                                    <td>
                                        <CellText>{`${numberFormatter.format(
                                            item.MAL_EST_MALARIA_CASES
                                        )} [${numberFormatter.format(
                                            item.MAL_EST_MALARIA_CASES_LOWER
                                        )}, ${numberFormatter.format(item.MAL_EST_MALARIA_CASES_UPPER)}]`}</CellText>
                                    </td>
                                    <td>
                                        <CellText>{`${numberFormatter.format(
                                            item.MAL_EST_MALARIA_DEATHS
                                        )} [${numberFormatter.format(
                                            item.MAL_EST_MALARIA_DEATHS_LOWER
                                        )}, ${numberFormatter.format(item.MAL_EST_MALARIA_DEATHS_UPPER)}]`}</CellText>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
                <Trans i18nKey="" t={t}>
                    {"Source: "}
                    <Link href="#" color="blue">
                        {"Who World malaria report 2021"}
                    </Link>
                </Trans>
            </DasboardCard>
        </React.Fragment>
    );
};

export default EpidemiologicalProfileDashboard;

const DasboardCard = styled(Card)`
    padding: 16px 42px;
    margin-bottom: 24px;
`;

const Title = styled.h3`
    font-size: 23px;
    margin-bottom: 30px;
    color: #2ba681;
    text-transform: uppercase;
`;

const HeadText = styled(Typography)`
    font-size: 16px;
    font-weight: bold;
    color: #343434;
`;

const SubHeadText = styled(Typography)`
    font-size: 16px;
    font-weight: bold;
    padding: 0px 30px;
    color: #343434;
`;

const CellText = styled(Typography)`
    font-size: 14px;
    padding: 8px 30px;
    color: #444444;
`;

const Table = styled.table`
    margin-bottom: 24px;
    min-height: 200px;
    width: 100%;
    border-collapse: collapse;
    tr th {
        border: 2px solid #0000001a;
        font-size: 14px;
        height: 40px;
    }

    tr th {
        border-top: 0;
    }

    tr th:first-child {
        border-left: 0;
    }

    tr th:last-child {
        border-right: 0;
    }

    tr th:nth-child(3) {
        border-right: 0;
    }
    tr th:nth-child(4) {
        border-left: 0;
        border-right: 0;
    }
    tr th:nth-child(5) {
        border-left: 0;
        border-right: 0;
    }
    tr th:nth-child(6) {
        border-right: 0;
    }
    tr th:nth-child(7) {
        border-left: 0;
    }

    tr td {
        border: 2px solid #0000001a;
    }

    tr td:first-child {
        border-left: 0;
    }

    tr td:nth-child(3) {
        border-right: 0;
    }
    tr td:nth-child(4) {
        border-left: 0;
        border-right: 0;
    }
    tr td:nth-child(5) {
        border-left: 0;
        border-right: 0;
    }
    tr td:nth-child(6) {
        border-right: 0;
    }
    tr td:nth-child(7) {
        border-left: 0;
    }
    tr td:last-child {
        border-right: 0;
    }

    tr:last-child td {
        border-bottom: 0;
    }
`;
