import React, { Component } from "react";
import { connect } from "react-redux";
import { setRegionAction } from "../../store/actions/base-actions";
import { selectCountryLayer } from "../../store/reducers/country-layer-reducer";
import { selectRegion } from "../../store/reducers/base-reducer";
import { State } from "../../store/types";
import { Translation } from "../../types/Translation";
import IntegrationReactSelect from "../BasicSelect";
import { selectSubRegions } from "../../store/reducers/translations-reducer";

const mapStateToProps = (state: State) => ({
  region: selectRegion(state),
  countryLayer: selectCountryLayer(state),
  subRegions: selectSubRegions(state)
});

const mapDispatchToProps = {
  setRegion: setRegionAction
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

class SubRegionSelector extends Component<Props> {
  onChange = (selection: any) => {
    this.props.setRegion({
      subRegion: selection ? selection.value : undefined
    });
  };
  render() {
    const { region, subRegions = [] } = this.props;
    const suggestions: any[] = (subRegions as Translation[]).map(subRegion => ({
      label: subRegion.VALUE_,
      value: subRegion.VALUE_
    }));
    return (
      <IntegrationReactSelect
        isClearable
        placeholder={"Select Sub Region"}
        suggestions={suggestions}
        onChange={this.onChange}
        value={
          suggestions.find((s: any) => s.value === region.subRegion) || null
        }
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubRegionSelector);
