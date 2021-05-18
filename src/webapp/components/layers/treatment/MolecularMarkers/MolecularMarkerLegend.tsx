import React from "react";
import {
    LegendContainer,
    LegendFooter,
    LegendLabels,
    LegendTitleContainer,
    LegendTitleTypography,
    LegendSubtitleTypography,
} from "../../../Leyend";
import { MOLECULAR_MARKER_STATUS } from "./utils";
import { MolecularMarkerColors } from "./molecularMarkerSymbols";
import { useTranslation } from "react-i18next";
import { State } from "../../../../store/types";
import { connect } from "react-redux";
import { selectTreatmentFilters } from "../../../../store/reducers/treatment-reducer";

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
    const molecularMarkerTranslator = ["Pfkelch13", "Pfcrt", "Pfmdr1", "Pfplasmepsin 2-3"];
    return (
        <LegendContainer>
            <LegendTitleContainer>
                <LegendTitleTypography color="textPrimary" gutterBottom>
                    {t("treatment.molecular_markers")}
                </LegendTitleTypography>
                <LegendSubtitleTypography>
                    {molecularMarkerTranslator[treatmentFilters.molecularMarker - 1]}
                </LegendSubtitleTypography>
            </LegendTitleContainer>
            <LegendLabels labels={labels} />
            <LegendFooter />
        </LegendContainer>
    );
}
export default connect(mapStateToProps, null)(MolecularMarkerLeyend);
