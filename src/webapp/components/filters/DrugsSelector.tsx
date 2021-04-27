import React from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import IntegrationReactSelect, { Option } from "../BasicSelect";
import { selectDrugs } from "../../store/reducers/translations-reducer";
import { selectTreatmentStudies } from "../../store/reducers/treatment-reducer";
import * as R from "ramda";
import { Divider, FilterWrapper } from "./Filters";
import FormLabel from "@material-ui/core/FormLabel";
import T from "../../translations/T";
import { useTranslation } from "react-i18next";

const mapStateToProps = (state: State) => ({
    drugs: selectDrugs(state),
    studies: selectTreatmentStudies(state),
});

type OwnProps = {
    onChange: (selection: string[]) => void;
    value: string[];
};

type StateProps = ReturnType<typeof mapStateToProps>;
type Props = StateProps & OwnProps;

function DrugsSelector({ studies, onChange, value }: Props) {
    const { t } = useTranslation("common");
    const uniques = R.uniq(R.map(R.prop("DRUG_NAME"), studies)).filter(Boolean);

    const suggestions: any[] = uniques.map((drug: string) => ({
        label: t(drug),
        value: drug,
    }));

    const onSelectionChange = (options: Option[] = []) => {
        onChange((options || []).map(o => o.value));
    };

    const selection = suggestions.filter(suggestion => value.includes(suggestion.value));

    return (
        <FilterWrapper>
            <FormLabel component="legend">
                <T i18nKey={`filters.drug`} />
            </FormLabel>
            <Divider />
            <IntegrationReactSelect
                isMulti
                isClearable
                suggestions={R.sortBy(R.prop("label"), suggestions)}
                onChange={onSelectionChange}
                value={selection}
            />
        </FilterWrapper>
    );
}

export default connect(mapStateToProps, null)(DrugsSelector);
