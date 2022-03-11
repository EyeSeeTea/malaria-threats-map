import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { Box, Typography } from "@mui/material";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectTheme } from "../../../../store/reducers/base-reducer";
import { State } from "../../../../store/types";
import * as R from "ramda";
import Pagination from "../../../charts/Pagination";
import { MOLECULAR_MARKERS } from "../../../filters/MolecularMarkerFilter";
import { selectTreatmentFilters } from "../../../../store/reducers/treatment-reducer";
import { formatYears } from "../../../../utils/string-utils";
import { TreatmentStudy } from "../../../../../domain/entities/TreatmentStudy";
import { selectIsTooltipOpen } from "../../../../store/reducers/base-reducer";
import ViewSummaryDataButton from "../../../ViewSummaryDataButton";

const exists = (value: string) => {
    if (!value) {
        return false;
    }
    const trimmed = value.trim();
    return trimmed !== "N/A" && trimmed !== "NA" && trimmed !== null;
};

const ChatContainer = styled.div`
    max-width: 500px;
    width: 100%;
`;

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    treatmentFilters: selectTreatmentFilters(state),
    tooltipOpen: selectIsTooltipOpen(state),

});

type StateProps = ReturnType<typeof mapStateToProps>;
type OwnProps = {
    studies: TreatmentStudy[];
};
type Props = StateProps & OwnProps;

const MolecularMarkersPopup = ({ studies, treatmentFilters }: Props) => {
    const { t } = useTranslation();
    const [studyIndex, setStudy] = useState(0);
    const sortedStudies = R.sortBy(study => -parseInt(study.YEAR_START), studies);
    const minYear = parseInt(sortedStudies[sortedStudies.length - 1].YEAR_START);
    const maxYear = parseInt(sortedStudies[0].YEAR_START);

    const titleItems = [
        studies[studyIndex].SITE_NAME,
        studies[studyIndex].PROVINCE,
        t(studies[studyIndex].ISO2 === "NA" ? "common.COUNTRY_NA" : studies[studyIndex].ISO2),
    ];
    const title = titleItems.filter(Boolean).join(", ");
    const molecularMarker = t(MOLECULAR_MARKERS.find((m: any) => m.value === treatmentFilters.molecularMarker).label);
    const study = sortedStudies[sortedStudies.length - studyIndex - 1];

    const pfkelch13 = () => {
        return (
            <>
                <Typography variant="subtitle1">
                    <Box fontWeight="fontWeightBold">{`${title} (${minYear}-${maxYear})`}</Box>
                </Typography>
                <Typography variant="body2">
                    {t("common.treatment.chart.molecular_markers.site_content_1", {
                        year: study.YEAR_START,
                    })}{" "}
                    <i>{molecularMarker}</i>{" "}
                    {t("common.treatment.chart.molecular_markers.site_content_2", {
                        nStudies: study.N,
                        molecularMarker: t(`common.${molecularMarker}`),
                    })}
                </Typography>
                <ViewSummaryDataButton />

            </>
        );
    };

    const t_studies = studies.length === 1 ? t("common.treatment.chart.molecular_markers.study") : t("common.treatment.chart.molecular_markers.studies");

    return (
        <ChatContainer>
            {treatmentFilters.molecularMarker === 1 ? (
                pfkelch13()
            ) : (
                <>
                    <Typography variant="subtitle1">
                        <Box fontWeight="fontWeightBold">{`${title}`}</Box>
                    </Typography>
                    <Typography variant="subtitle2">
                        <Box>{`${studies.length} ${t_studies} ${formatYears(`${minYear}`, `${maxYear}`)}`}</Box>
                    </Typography>
                    <ViewSummaryDataButton />

                </>
            )}
        </ChatContainer>
    );
};
export default connect(mapStateToProps)(MolecularMarkersPopup);
