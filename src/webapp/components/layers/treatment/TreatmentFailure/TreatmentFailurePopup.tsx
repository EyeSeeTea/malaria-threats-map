import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { Box, Typography } from "@mui/material";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectTheme } from "../../../../store/reducers/base-reducer";
import { State } from "../../../../store/types";
import * as R from "ramda";
import { formatYears } from "../../../../utils/string-utils";
import { PLASMODIUM_SPECIES_SUGGESTIONS } from "../../../filters/PlasmodiumSpeciesFilter";
import { TreatmentStudy } from "../../../../../domain/entities/TreatmentStudy";
import ViewSummaryDataButton from "../../../ViewSummaryDataButton";

const ChatContainer = styled.div`
    max-width: 600px;
    width: 100%;
    @media all and (-ms-high-contrast: none) {
        & {
            width: 600px;
        }
    }
`;

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;
type OwnProps = {
    studies: TreatmentStudy[];
};
type Props = StateProps & OwnProps;

const TreatmentFailurePopup = ({ studies }: Props) => {
    const { t } = useTranslation();
    const [study, setStudy] = useState(0);
    const sortedStudies = R.sortBy(study => parseInt(study.YEAR_START), studies);
    const maxYear = parseInt(sortedStudies[sortedStudies.length - 1].YEAR_START);
    const minYear = parseInt(sortedStudies[0].YEAR_START);

    const {
        PLASMODIUM_SPECIES,
        DRUG_NAME,
    } = sortedStudies[study];

    const siteDuration = formatYears(`${minYear}`, `${maxYear}`);

    const titleItems = [
        studies[study].SITE_NAME,
        studies[study].PROVINCE,
        t(`countries.${studies[study].ISO2 === "NA" ? "common.COUNTRY_NA" : studies[study].ISO2}`),
    ];
    const title = titleItems.filter(Boolean).join(", ");

    const t_studies = t("common.treatment.chart.treatment_failure.studies");

    const plasmodiumSpecies = PLASMODIUM_SPECIES_SUGGESTIONS.find(
        (species: any) => species.value === PLASMODIUM_SPECIES
    ).label;

    return (
        <ChatContainer>
            <Typography variant="subtitle1">
                <Box fontWeight="fontWeightBold">{`${title}`}</Box>
            </Typography>
            <Typography variant="body2">
                <i>{plasmodiumSpecies}</i>
                {`, ${t(DRUG_NAME)}: ${studies.length} ${t_studies} ${siteDuration}`}
            </Typography>
            <ViewSummaryDataButton />

        </ChatContainer>
    );
};
export default connect(mapStateToProps)(TreatmentFailurePopup);
