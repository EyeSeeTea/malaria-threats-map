import React, { Component } from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import IntegrationReactSelect from "../BasicSelect";
import { selectDiagnosisFilters } from "../../store/reducers/diagnosis-reducer";
import { setDiagnosisDeletionType } from "../../store/actions/diagnosis-actions";
import { Divider, FilterWrapper } from "./Filters";
import FormLabel from "@material-ui/core/FormLabel";
import T from "../../translations/T";

const mapStateToProps = (state: State) => ({
  diagnosisFilters: selectDiagnosisFilters(state)
});

const mapDispatchToProps = {
  setDeletionType: setDiagnosisDeletionType
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

export const DELETION_TYPES = {
  HRP2_PROPORTION_DELETION: {
    label: "pfhrp2",
    value: "HRP2_PROPORTION_DELETION"
  },
  HRP2_HRP3_PROPORTION_DELETION: {
    label: "pfhrp2 + pfhrp3 (dual)",
    value: "HRP2_HRP3_PROPORTION_DELETION"
  }
};

class DeletionTypeFilter extends Component<Props, any> {
  onChange = (selection: any) => {
    this.props.setDeletionType(selection ? selection.value : null);
  };

  render() {
    const suggestions: any[] = Object.values(DELETION_TYPES);
    const selection = suggestions.find(
      suggestion =>
        this.props.diagnosisFilters.deletionType === suggestion.value
    );
    return (
      <FilterWrapper>
        <FormLabel component="legend">
          <T i18nKey={`filters.deletion_type`} />
        </FormLabel>
        <Divider />
        <IntegrationReactSelect
          suggestions={suggestions}
          onChange={this.onChange}
          value={selection}
        />
      </FilterWrapper>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeletionTypeFilter);
