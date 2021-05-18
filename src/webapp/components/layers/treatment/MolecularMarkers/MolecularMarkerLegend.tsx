import React from "react";
import {
    LegendContainer,
    LegendFooter,
    LegendLabels,
    LegendTitleContainer,
    LegendTitleTypography,
} from "../../../Leyend";
import { MOLECULAR_MARKER_STATUS } from "./utils";
import { MolecularMarkerColors } from "./molecularMarkerSymbols";
import { useTranslation } from "react-i18next";
import { State } from "../../../../store/types";
import { connect } from "react-redux";
import { selectTreatmentFilters } from "../../../../store/reducers/treatment-reducer";
import { MOLECULAR_MARKERS } from "../../../filters/MolecularMarkerFilter";

const mapStateToProps = (state: State) => ({
    treatmentFilters: selectTreatmentFilters(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;
type Props = StateProps;

function MolecularMarkerLeyend({ treatmentFilters }: Props) {
    const { t } = useTranslation("common");
    const labels = [
        {
            label: "treatment.legend.molecular_markers.high",
            color: MolecularMarkerColors[MOLECULAR_MARKER_STATUS.HIGH][0],
        },
        {
            label: "treatment.legend.molecular_markers.medium_high",
            color: MolecularMarkerColors[MOLECULAR_MARKER_STATUS.MEDIUM_HIGH][0],
        },
        {
            label: "treatment.legend.molecular_markers.medium",
            color: MolecularMarkerColors[MOLECULAR_MARKER_STATUS.MEDIUM][0],
        },
        {
            label: "treatment.legend.molecular_markers.low",
            color: MolecularMarkerColors[MOLECULAR_MARKER_STATUS.LOW][0],
        },
    ];

    return (
        <LegendContainer>
            <LegendTitleContainer>
                <LegendTitleTypography color="textPrimary" gutterBottom>
                    {t("treatment.molecular_markers")} ({MOLECULAR_MARKERS[treatmentFilters.molecularMarker - 1].label})
                </LegendTitleTypography>
            </LegendTitleContainer>
            <LegendLabels labels={labels} />
            <LegendFooter />
        </LegendContainer>
    );
}
export default connect(mapStateToProps, null)(MolecularMarkerLeyend);
