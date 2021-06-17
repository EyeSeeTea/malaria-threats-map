import React, { Component } from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import IntegrationReactSelect from "../BasicSelect";
import { Translation } from "../../types/Translation";
import { selectTypes } from "../../store/reducers/translations-reducer";
import { selectPreventionFilters } from "../../store/reducers/prevention-reducer";
import { setSynergistTypes } from "../../store/actions/prevention-actions";
import { Divider, FilterWrapper } from "./Filters";
import FormLabel from "@material-ui/core/FormLabel";
import T from "../../translations/T";
import { sendMultiFilterAnalytics } from "../../utils/analytics";

const mapStateToProps = (state: State) => ({
    synergistTypes: selectTypes(state),
    preventionFilters: selectPreventionFilters(state),
});

const mapDispatchToProps = {
    setSynergistTypes: setSynergistTypes,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

class SynergistTypeFilter extends Component<Props, any> {
    onChange = (selection: any[]) => {
        this.props.setSynergistTypes((selection || []).map(selection => selection.value));
        sendMultiFilterAnalytics("testType", this.props.preventionFilters.synergistTypes, selection);
    };

    render() {
        const suggestions: any[] = (this.props.synergistTypes as Translation[])
            .filter(translation => ["WHO_TEST_KIT_ADULTS", "CDC_BOTTLE_ADULTS"].includes(translation.VALUE_))
            .map((country: Translation) => ({
                label: country.VALUE_,
                value: country.VALUE_,
            }));
        const selection = suggestions.filter(suggestion =>
            this.props.preventionFilters.synergistTypes.includes(suggestion.value)
        );
        return (
            <FilterWrapper>
                <FormLabel component="legend">
                    <T i18nKey={"common.filters.synergist_type"} />
                </FormLabel>
                <Divider />
                <IntegrationReactSelect
                    isMulti
                    isClearable
                    suggestions={suggestions}
                    onChange={this.onChange}
                    value={selection}
                />
            </FilterWrapper>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SynergistTypeFilter);
