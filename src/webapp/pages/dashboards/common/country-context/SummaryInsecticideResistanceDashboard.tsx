import React from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@mui/material";
import styled from "styled-components";
import CountryContextSource from "./CountryContextSource";
import { useSummaryInsecticideResistance } from "./useSummaryInsecticideResistance";

const SummaryInsecticideResistanceDashboard: React.FC = () => {
    const { t } = useTranslation();
    const data = useSummaryInsecticideResistance();

    return (
        <React.Fragment>
            <DasboardCard>
                <Title id="summary-insecticide-resistance">
                    {t("common.dashboard.countryContextDashboards.summaryInsecticideResistance.title")}
                </Title>
                <TableContainer>
                    <Table>
                        <thead>
                            <tr>
                                <th>
                                    {t(
                                        "common.dashboard.countryContextDashboards.summaryInsecticideResistance.country"
                                    )}
                                </th>
                                <th>
                                    {t(
                                        "common.dashboard.countryContextDashboards.summaryInsecticideResistance.vectorSpecies"
                                    )}
                                </th>
                                <th>
                                    {t(
                                        "common.dashboard.countryContextDashboards.summaryInsecticideResistance.insecticideClasses"
                                    )}
                                </th>
                                <th>
                                    {t(
                                        "common.dashboard.countryContextDashboards.summaryInsecticideResistance.resistanceMechanisms"
                                    )}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(item => {
                                return (
                                    <tr key={item.country}>
                                        <td>{t(item.country)}</td>
                                        <td>{item.vectorSpecies}</td>
                                        <td>{item.insectidiceClasses}</td>
                                        <td>{item.resistanceMechanisms}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </TableContainer>
                <CountryContextSource />
            </DasboardCard>
        </React.Fragment>
    );
};

export default SummaryInsecticideResistanceDashboard;

const DasboardCard = styled(Card)`
    padding: 16px 42px;
`;

const Title = styled.h3`
    font-size: 23px;
    margin-bottom: 30px;
    color: #2ba681;
    text-transform: uppercase;
`;

const TableContainer = styled.div`
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
`;

const Table = styled.table`
    margin-bottom: 24px;
    width: 100%;
    border-collapse: collapse;
    tr th {
        font-size: 16px;
        font-weight: bold;
        padding: 16px;
        text-align: left;
    }
    tr td {
        font-size: 14px;
        padding: 16px;
        text-align: left;
    }

    tr:nth-child(odd) {
        border-bottom: 2px solid #0000001a;
    }

    tr:nth-child(even) {
        border-bottom: 2px solid #0000001a;
    }
`;
