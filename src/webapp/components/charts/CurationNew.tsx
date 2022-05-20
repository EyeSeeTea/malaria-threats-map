import * as React from "react";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Study } from "../../../domain/entities/Study";
import { isNotNull } from "../../utils/number-utils";
import _ from "lodash";

const Margin = styled.div`
    margin-top: 10px;
    margin-bottom: 10px;
`;

type OwnProps = {
    studies: Partial<Study>[];
};
type Props = OwnProps;

const CurationNew = ({ studies }: Props) => {
    const [curations, setCurations] = React.useState<string[]>([]);

    React.useEffect(() => {
        setCurations(
            _.uniq(
                studies
                    .filter(study => isNotNull(study.INSTITUTE_CURATION || study.CURATION))
                    .map(study => study.INSTITUTE_CURATION || study.CURATION)
            )
        );
    }, [studies]);

    const { t } = useTranslation();
    return (
        <Margin>
            <Typography variant="caption">
                <b>{t("common.invasive.chart.vector_occurrance.data_collection")}</b>
            </Typography>
            <br />
            {curations.length > 0 &&
                curations.map(curation => {
                    return (
                        <Typography key={curation} variant="caption">
                            {curation}
                        </Typography>
                    );
                })}
        </Margin>
    );
};

export default CurationNew;
