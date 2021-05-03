import React from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import IntegrationReactSelect, { Option } from "../BasicSelect";
import { selectSpecies } from "../../store/reducers/translations-reducer";
import { selectPreventionStudies } from "../../store/reducers/prevention-reducer";
import * as R from "ramda";
import FormLabel from "@material-ui/core/FormLabel";
import { Divider, FilterWrapper } from "./Filters";
import T from "../../translations/T";

const mapStateToProps = (state: State) => ({
    species: selectSpecies(state),
    studies: selectPreventionStudies(state),
});

type OwnProps = {
    onChange: (selection: string[]) => void;
    value: string[];
};

type StateProps = ReturnType<typeof mapStateToProps>;
type Props = StateProps & OwnProps;

function SpeciesSelector({ studies, onChange, value }: Props) {
    const uniques = R.uniq(R.map(R.prop("SPECIES"), studies)).sort();

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
                <T i18nKey={"filters.vector_species"} />
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

export default connect(mapStateToProps, null)(SpeciesSelector);
