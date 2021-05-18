import React from "react";
import IntegrationReactSelect, { Option } from "../BasicSelect";
import { Divider, FilterWrapper } from "./Filters";
import FormLabel from "@material-ui/core/FormLabel";
import T from "../../translations/T";
import * as R from "ramda";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { selectPreventionStudies } from "../../store/reducers/prevention-reducer";

const mapStateToProps = (state: State) => ({
    studies: selectPreventionStudies(state),
});

type OwnProps = {
    onChange: (selection: string[]) => void;
    value: string[];
};

type StateProps = ReturnType<typeof mapStateToProps>;
type Props = StateProps & OwnProps;

function InsecticideTypeSelector({ studies, onChange, value }: Props) {
    const uniques = R.uniq(R.map(R.prop("INSECTICIDE_TYPE"), studies)).sort();

    const suggestions: any[] = uniques.map((specie: string) => ({
        label: specie,
        value: specie,
    }));

    const onSelectionChange = (options: Option[] = []) => {
        onChange((options || []).map(o => o.value));
    };

    const selection = suggestions.filter(suggestion => value.includes(suggestion.value));

    return (
        <FilterWrapper>
            <FormLabel component="legend">
                <T i18nKey={`filters.insecticide_type`} />
            </FormLabel>
            <Divider />
            <IntegrationReactSelect
                isMulti
                isClearable
                suggestions={suggestions}
                onChange={onSelectionChange}
                value={selection}
            />
        </FilterWrapper>
    );
}
export default connect(mapStateToProps, null)(InsecticideTypeSelector);
