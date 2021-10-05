import * as React from "react";
import { Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Study } from "../../domain/entities/Study";

const Margin = styled.div`
    margin-top: 10px;
    margin-bottom: 10px;
`;

type OwnProps = {
    study: Partial<Study>;
};
type Props = OwnProps;

const isNull = (value: string) => value === "NA" || value === null || !value;

const Curation = ({ study }: Props) => {
    const { t } = useTranslation();
    return !isNull(study.INSTITUTE_CURATION || study.CURATION) ? (
        <Margin>
            <Typography variant="caption">
                <b>{t("common.invasive.chart.vector_occurrance.data_collection")}</b>
            </Typography>
            <br />
            <Typography variant="caption">{study.INSTITUTE_CURATION || study.CURATION}</Typography>
        </Margin>
    ) : (
        <div />
    );
};

export default Curation;
