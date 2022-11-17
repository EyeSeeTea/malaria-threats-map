import React from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@mui/material";
import styled from "styled-components";
import { useCountryContextData } from "./context/useCountryContextData";
import CountryContextSource from "./CountryContextSource";
import _ from "lodash";

const VectorsDashboard: React.FC = () => {
    const { t } = useTranslation();
    const { data } = useCountryContextData();

    return (
        <React.Fragment>
            <DasboardCard>
                <Title id="vectors">{t("common.dashboard.countryContextDashboards.vectors.title")}</Title>
                <Table>
                    <thead>
                        <tr>
                            <th> {t("common.dashboard.countryContextDashboards.vectors.country")}</th>
                            <th>{t("common.dashboard.countryContextDashboards.vectors.species")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(item => {
                            const species = _.compact([
                                item.MAL_MAIN_MALARIA_VECTORS_VECTOR_1,
                                item.MAL_MAIN_MALARIA_VECTORS_VECTOR_2,
                                item.MAL_MAIN_MALARIA_VECTORS_VECTOR_3,
                                item.MAL_MAIN_MALARIA_VECTORS_VECTOR_4,
                                item.MAL_MAIN_MALARIA_VECTORS_VECTOR_5,
                            ]);

                            return (
                                <tr key={item.ORGANISATIONUNITCODE}>
                                    <td>{item.ORGANISATIONUNITNAME}</td>
                                    <td>{species.join(", ")}</td>
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

export default VectorsDashboard;

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
