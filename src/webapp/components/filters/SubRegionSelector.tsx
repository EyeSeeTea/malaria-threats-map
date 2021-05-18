import React, { Component } from "react";
import { connect } from "react-redux";
import { setRegionAction } from "../../store/actions/base-actions";
import { selectRegion } from "../../store/reducers/base-reducer";
import { State } from "../../store/types";
import { Translation } from "../../types/Translation";
import IntegrationReactSelect from "../BasicSelect";
import { selectSubRegions } from "../../store/reducers/translations-reducer";
import FormLabel from "@material-ui/core/FormLabel";
import { Divider, FilterWrapper } from "./Filters";
import T from "../../translations/T";
import { sendAnalytics } from "../../utils/analytics";

const mapStateToProps = (state: State) => ({
    region: selectRegion(state),
    subRegions: selectSubRegions(state),
});

const mapDispatchToProps = {
    setRegion: setRegionAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

class SubRegionSelector extends Component<Props> {
    onChange = (selection: any) => {
        const label = selection ? selection.value : undefined;
        if (label) sendAnalytics({ type: "event", category: "geoFilter", action: "subRegion", label });
        this.props.setRegion({
            subRegion: selection ? selection.value : undefined,
        });
    };
    render() {
        const { region, subRegions = [] } = this.props;
        const suggestions: any[] = (subRegions as Translation[]).map(subRegion => ({
            label: subRegion.VALUE_,
            value: subRegion.VALUE_,
        }));

        return (
            <FilterWrapper>
                <FormLabel component="legend">
                    <T i18nKey={"filters.sub_region"} />
                </FormLabel>
                <Divider />
                <IntegrationReactSelect
                    isClearable
                    placeholder={"Select Sub Region"}
                    suggestions={suggestions}
                    onChange={this.onChange}
                    value={suggestions.find((s: any) => s.value === region.subRegion) || null}
                />
            </FilterWrapper>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SubRegionSelector);
