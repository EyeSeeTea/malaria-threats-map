import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { Card, Link, Typography } from "@mui/material";
import styled from "styled-components";
import { useCountryContextData } from "./context/useCountryContextData";

const MajorPlamociumSpeciesDashboard: React.FC = () => {
    const { t } = useTranslation();
    const { data } = useCountryContextData();

    return (
        <React.Fragment>
            <DasboardCard>
                <Title>{t("common.dashboard.countryContextSection.majorPlamociumSpecies.title")}</Title>
                <Table>
                    <thead>
                        <tr>
                            <th> {t("common.dashboard.countryContextSection.majorPlamociumSpecies.country")}</th>
                            <th>{t("common.dashboard.countryContextSection.majorPlamociumSpecies.species")}</th>
                            <th>
                                {t("common.dashboard.countryContextSection.majorPlamociumSpecies.firstLineTreatments")}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(item => {
                            return (
                                <React.Fragment key={item.ORGANISATIONUNITNAME}>
                                    <tr>
                                        <td rowSpan={2}>{item.ORGANISATIONUNITNAME}</td>
                                        <td>{`P. falciparum (?%)`}</td>
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
                                        <td>{`P. vivax (?%)`}</td>
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

export default MajorPlamociumSpeciesDashboard;

const DasboardCard = styled(Card)`
    min-height: 500px;
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
