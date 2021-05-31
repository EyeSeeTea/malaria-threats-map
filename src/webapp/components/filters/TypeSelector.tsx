import React from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import IntegrationReactSelect, { Option } from "../BasicSelect";
import { selectTypes } from "../../store/reducers/translations-reducer";
import { selectPreventionStudies } from "../../store/reducers/prevention-reducer";
import FormLabel from "@material-ui/core/FormLabel";
import { Divider, FilterWrapper } from "./Filters";
import { useTranslation } from "react-i18next";

const TYPES: string[] = ["WHO_TEST_KIT_ADULTS", "CDC_BOTTLE_ADULTS"];

const mapStateToProps = (state: State) => ({
    types: selectTypes(state),
    studies: selectPreventionStudies(state),
});

type OwnProps = {
    onChange: (selection: string[]) => void;
    value: string[];
};

type StateProps = ReturnType<typeof mapStateToProps>;
type Props = StateProps & OwnProps;

function TypeSelector({ onChange, value }: Props) {
    const { t } = useTranslation();
    // const uniques = R.uniq(R.map(R.prop("TYPE"), studies)).sort();

    const suggestions: any[] = TYPES.map((specie: string) => ({
        label: specie,
        value: specie,
    }));

    const onSelectionChange = (options: Option[] = []) => {
        onChange((options || []).map(o => o.value));
    };

    const selection = suggestions.filter(suggestion => value.includes(suggestion.value));

    return (
        <FilterWrapper>
            <FormLabel component="legend">{t("common.filters.test_type")}</FormLabel>
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

export default connect(mapStateToProps, null)(TypeSelector);
