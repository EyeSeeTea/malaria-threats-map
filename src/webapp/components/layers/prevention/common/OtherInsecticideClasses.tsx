import * as React from "react";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import _ from "lodash";
import { PreventionStudy } from "../../../../../domain/entities/PreventionStudy";
import { isNotNull } from "../../../../utils/number-utils";

const Margin = styled.div`
    margin-top: 10px;
    margin-bottom: 10px;
`;

type OwnProps = {
    siteFilteredStudies: PreventionStudy[];
    siteNonFilteredStudies: PreventionStudy[];
};

type Props = OwnProps;

const OtherInsecticideClasses = ({ siteFilteredStudies, siteNonFilteredStudies }: Props) => {
    const [otherInsecticideclasses, setOtherInsecticideclasses] = React.useState<string[]>([]);
    const { t } = useTranslation();

    React.useEffect(() => {
        const currentInsecticideClasses = _.uniq(siteFilteredStudies.map(study => study.INSECTICIDE_CLASS));
        const other = _.uniq(
            siteNonFilteredStudies
                .filter(
                    study =>
                        !currentInsecticideClasses.includes(study.INSECTICIDE_CLASS) &&
                        isNotNull(study.INSECTICIDE_CLASS)
                )
                .map(study => study.INSECTICIDE_CLASS)
        );

        setOtherInsecticideclasses(other);
    }, [siteFilteredStudies, siteNonFilteredStudies]);

    return (
        <Margin>
            <Typography variant="caption">
                <b>{t("common.prevention.chart.other_insecticide_class_label")}</b>
            </Typography>
            <br />
            {otherInsecticideclasses.length > 0 ? (
                otherInsecticideclasses.map(insecticideclass => {
                    return (
                        <Typography key={insecticideclass} variant="caption" display="block">
                            {t(insecticideclass)}
                        </Typography>
                    );
                })
            ) : (
                <Typography variant="caption">{t("common.prevention.chart.other_insecticide_class_none")}</Typography>
            )}
        </Margin>
    );
};

export default OtherInsecticideClasses;
