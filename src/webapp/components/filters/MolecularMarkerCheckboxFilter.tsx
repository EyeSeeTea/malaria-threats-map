import React from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { Checkbox, FormControlLabel, FormGroup, Typography } from "@mui/material";
import styled from "styled-components";

import { State } from "../../store/types";
import { setMolecularMarkers } from "../../store/actions/treatment-actions";
import { selectTreatmentFilters } from "../../store/reducers/treatment-reducer";
import { Divider, FilterColumContainer } from "./Filters";
import {
    MOLECULAR_MARKERS_LABELS,
    MOLECULAR_MARKERS_MAP,
} from "../layers/treatment/MolecularMarkersOngoingStudies/utils";

const mapStateToProps = (state: State) => ({
    treatmentFilters: selectTreatmentFilters(state),
});

const mapDispatchToProps = {
    setMolecularMarkers: setMolecularMarkers,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

function MolecularMarkerCheckboxFilter({ treatmentFilters, setMolecularMarkers }: Props) {
    const { t } = useTranslation();

    const handleCheckboxChange = React.useCallback(
        (molecularMarkerSelected: number, isChecked: boolean) => {
            const newMolecularMarkerValues: number[] =
                isChecked && !treatmentFilters.molecularMarkers.includes(molecularMarkerSelected)
                    ? [...treatmentFilters.molecularMarkers, molecularMarkerSelected]
                    : treatmentFilters.molecularMarkers.filter(
                          molecularMarkerValue => molecularMarkerValue !== molecularMarkerSelected
                      );
            setMolecularMarkers(newMolecularMarkerValues);
        },
        [setMolecularMarkers, treatmentFilters.molecularMarkers]
    );

    return (
        <FilterColumContainer>
            <Typography color="dimgray" component="legend" variant="body2">
                {t("common.filters.molecular_marker")}
            </Typography>
            <Divider />
            <FormGroup>
                {MOLECULAR_MARKERS_LABELS.filter(
                    molecularMarker => molecularMarker.value !== MOLECULAR_MARKERS_MAP.MM_PFMDR1
                ).map(({ label, value }) => (
                    <StyledFormControlLabel
                        key={label}
                        control={
                            <Checkbox
                                color="primary"
                                checked={treatmentFilters.molecularMarkers.includes(value)}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    handleCheckboxChange(value, e.target.checked)
                                }
                            />
                        }
                        label={label}
                    />
                ))}
            </FormGroup>
        </FilterColumContainer>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(MolecularMarkerCheckboxFilter);

const StyledFormControlLabel = styled(FormControlLabel)`
    & span {
        padding: 2px;
        font-size: 14px;
    }
`;
