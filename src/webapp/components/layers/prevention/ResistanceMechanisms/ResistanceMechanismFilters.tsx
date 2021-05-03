import React from "react";
import YearRangeSelector from "../../../YearRangeSelector";
import SpeciesFilter from "../../../filters/SpeciesFilter";
import MechanismTypeFilter from "../../../filters/MechanismTypeFilter";
import AssayTypeCheckboxFilter from "../../../filters/AssayTypeCheckboxFilter";
import { PreventionFilters, State } from "../../../../store/types";
import { selectPreventionFilters } from "../../../../store/reducers/prevention-reducer";
import { connect } from "react-redux";
import SynergistTypeFilter from "../../../filters/SynergistTypeFilter";

const mapStateToProps = (state: State) => ({
    preventionFilters: selectPreventionFilters(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;
type Props = StateProps;

export const isSynergyst = (filters: PreventionFilters) =>
    filters.assayTypes.length === 1 && filters.assayTypes[0] === "SYNERGIST-INSECTICIDE_BIOASSAY";

function ResistanceMechanismFilters({ preventionFilters }: Props) {
    return (
        <div>
            <MechanismTypeFilter />
            <AssayTypeCheckboxFilter />
            <SpeciesFilter />
            {isSynergyst(preventionFilters) && <SynergistTypeFilter />}
            <YearRangeSelector minYear={2010} maxYear={new Date().getFullYear()} />
        </div>
    );
}

export default connect(mapStateToProps, null)(ResistanceMechanismFilters);
