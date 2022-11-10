import React from "react";
import { useTranslation } from "react-i18next";
import { Card, Stack, Tooltip, tooltipClasses, TooltipProps, Typography } from "@mui/material";
import styled from "styled-components";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useCountryContextData } from "./context/useCountryContextData";
import CountryContextSource from "./CountryContextSource";

const numberFormatter = Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

const EpidemiologicalProfileDashboard: React.FC = () => {
    const { t } = useTranslation();

    const { data } = useCountryContextData();

    return (
        <React.Fragment>
            <DasboardCard>
                <Title id="epidemiological-profile">
                    {t("common.dashboard.countryContextDashboards.epidemiologicalProfile.title")}
                </Title>
                <Table>
                    <thead>
                        <tr>
                            <th>
                                <HeadText>
                                    {t("common.dashboard.countryContextDashboards.epidemiologicalProfile.country")}
                                </HeadText>
                            </th>
                            <th>
                                <HeadText>
                                    {t("common.dashboard.countryContextDashboards.epidemiologicalProfile.year")}
                                </HeadText>
                            </th>
                            <th colSpan={3}>
                                <HeadText>
                                    {t("common.dashboard.countryContextDashboards.epidemiologicalProfile.transmission")}
                                </HeadText>
                            </th>
                            <th colSpan={2}>
                                <HeadText>
                                    {t(
                                        "common.dashboard.countryContextDashboards.epidemiologicalProfile.burdenEstimates"
                                    )}
                                </HeadText>
                            </th>
                        </tr>
                        <tr>
                            <th></th>
                            <th></th>
                            <th>
                                <SubHeadText align="left">
                                    {t(
                                        "common.dashboard.countryContextDashboards.epidemiologicalProfile.highTransmission"
                                    )}
                                </SubHeadText>
                                <SubHeadText align="left">
                                    {t(
                                        "common.dashboard.countryContextDashboards.epidemiologicalProfile.moreThanOneCase"
                                    )}
                                </SubHeadText>
                            </th>
                            <th>
                                <SubHeadText align="left">
                                    {t(
                                        "common.dashboard.countryContextDashboards.epidemiologicalProfile.lowTransmission"
                                    )}
                                </SubHeadText>
                                <SubHeadText align="left">
                                    {t(
                                        "common.dashboard.countryContextDashboards.epidemiologicalProfile.lessOrEqualtoOneCase"
                                    )}
                                </SubHeadText>
                            </th>
                            <th>
                                <Stack direction="row" alignItems="center">
                                    <Stack direction="column">
                                        <SubHeadText align="left">
                                            {t(
                                                "common.dashboard.countryContextDashboards.epidemiologicalProfile.malariaFree"
                                            )}
                                        </SubHeadText>
                                        <SubHeadText align="left">
                                            {t(
                                                "common.dashboard.countryContextDashboards.epidemiologicalProfile.zeroCases"
                                            )}
                                        </SubHeadText>
                                    </Stack>
                                    <HtmlTooltip
                                        title={
                                            <React.Fragment>
                                                <Typography variant="body2" fontWeight="bold" sx={{ marginBottom: 2 }}>
                                                    {t(
                                                        "common.dashboard.countryContextDashboards.epidemiologicalProfile.malariaFree"
                                                    )}
                                                </Typography>
                                                <Typography variant="body2">
                                                    {t(
                                                        "common.dashboard.countryContextDashboards.epidemiologicalProfile.malariaFreeInfo"
                                                    )}
                                                </Typography>
                                            </React.Fragment>
                                        }
                                        arrow
                                    >
                                        <InfoOutlinedIcon />
                                    </HtmlTooltip>
                                </Stack>
                            </th>
                            <th>
                                <SubHeadText align="left">
                                    {t(
                                        "common.dashboard.countryContextDashboards.epidemiologicalProfile.estimatedCases"
                                    )}
                                </SubHeadText>
                            </th>
                            <th>
                                <SubHeadText align="left">
                                    {t(
                                        "common.dashboard.countryContextDashboards.epidemiologicalProfile.estimatedDeaths"
                                    )}
                                </SubHeadText>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* TODO: move this calculations to presenter (custom hook) */}
                        {data.map(item => {
                            return (
                                <tr key={item.ORGANISATIONUNITNAME}>
                                    <td>
                                        <CellText>{item.ORGANISATIONUNITNAME}</CellText>
                                    </td>
                                    <td>
                                        <CellText>{item.PERIODID}</CellText>
                                    </td>
                                    <td>
                                        <CellText>{`${numberFormatter.format(item.MAL_CALC_POP_AT_RISK_HIGH)} (${(
                                            (item.MAL_CALC_POP_AT_RISK_HIGH / item.MAL_POP_UN) *
                                            100
                                        ).toFixed()}%)`}</CellText>
                                    </td>
                                    <td>
                                        <CellText>{`${numberFormatter.format(
                                            item.MAL_CALC_POP_AT_RISK_LOW_HIGH - item.MAL_CALC_POP_AT_RISK_HIGH
                                        )} (${(
                                            ((item.MAL_CALC_POP_AT_RISK_LOW_HIGH - item.MAL_CALC_POP_AT_RISK_HIGH) /
                                                item.MAL_POP_UN) *
                                            100
                                        ).toFixed()}%)`}</CellText>
                                    </td>
                                    <td>
                                        <CellText>{`${numberFormatter.format(
                                            item.MAL_POP_UN - item.MAL_CALC_POP_AT_RISK_LOW_HIGH
                                        )} (${(
                                            ((item.MAL_POP_UN - item.MAL_CALC_POP_AT_RISK_LOW_HIGH) / item.MAL_POP_UN) *
                                            100
                                        ).toFixed()}%)`}</CellText>
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
                <CountryContextSource />
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

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: "white",
        color: "black",
        maxWidth: 300,
        padding: "16px",
        borderRadius: "10px",
        boxShadow: "0px 4px 8px #00000080",
    },
    [`& .${tooltipClasses.arrow}:before `]: {
        backgroundColor: "white",
        boxShadow: "0px 4px 8px #00000080",
    },
}));

const HeadText = styled(Typography)`
    font-size: 16px;
    font-weight: bold;
    color: #343434;
`;

const SubHeadText = styled(Typography)`
    font-size: 14px;
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
