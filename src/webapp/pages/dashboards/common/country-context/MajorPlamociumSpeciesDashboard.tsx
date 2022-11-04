import React from "react";
import { useTranslation } from "react-i18next";
import { Card, Typography } from "@mui/material";
import styled from "styled-components";
import { useCountryContextData } from "./context/useCountryContextData";
import CountryContextSource from "./CountryContextSource";

const MajorPlamociumSpeciesDashboard: React.FC = () => {
    const { t } = useTranslation();
    const { data } = useCountryContextData();

    return (
        <React.Fragment>
            <DasboardCard>
                <Title id="major-plasmodium">
                    {t("common.dashboard.countryContextDashboards.majorPlamociumSpecies.title")}
                </Title>
                <Table>
                    <thead>
                        <tr>
                            <th> {t("common.dashboard.countryContextDashboards.majorPlamociumSpecies.country")}</th>
                            <th>{t("common.dashboard.countryContextDashboards.majorPlamociumSpecies.species")}</th>
                            <th>
                                {t(
                                    "common.dashboard.countryContextDashboards.majorPlamociumSpecies.firstLineTreatments"
                                )}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(item => {
                            return (
                                <React.Fragment key={item.ORGANISATIONUNITNAME}>
                                    <tr>
                                        <td rowSpan={2}>{item.ORGANISATIONUNITNAME}</td>
                                        <td>{`P. falciparum (${(item.MAL_CALC_PERPF * 100).toFixed()}%)`}</td>
                                        <td>
                                            {item.MAL_PROFILE_MEDICINE_FOR_1ST_LINE_TRT_OF_PF &&
                                                item.MAL_PROFILE_MEDICINE_FOR_1ST_LINE_TRT_OF_PF.split("; ").map(
                                                    drug => {
                                                        return (
                                                            <Typography key={drug}>{`${t(
                                                                `DRUG_${drug}`
                                                            )} (${drug})`}</Typography>
                                                        );
                                                    }
                                                )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{`P. vivax (${(item.MAL_CALC_PERPV * 100).toFixed()}%)`}</td>
                                        <td>
                                            {item.MAL_PROFILE_MEDICINE_FOR_TRT_OF_PVIVAX &&
                                                item.MAL_PROFILE_MEDICINE_FOR_TRT_OF_PVIVAX.split(";").map(drug => {
                                                    return (
                                                        <Typography key={drug}>{`${t(
                                                            `DRUG_${drug}`
                                                        )} (${drug})`}</Typography>
                                                    );
                                                })}
                                        </td>
                                    </tr>
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </Table>
                <CountryContextSource />
            </DasboardCard>
        </React.Fragment>
    );
};

export default MajorPlamociumSpeciesDashboard;

const DasboardCard = styled(Card)`
    padding: 16px 42px;
`;

const Title = styled.h3`
    font-size: 23px;
    margin-bottom: 30px;
    color: #2ba681;
    text-transform: uppercase;
`;

const Table = styled.table`
    margin-bottom: 24px;
    width: 100%;
    border-collapse: collapse;
    tr th {
        border-bottom: 2px solid #0000001a;
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
