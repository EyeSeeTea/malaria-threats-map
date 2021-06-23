import React from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { selectDrugs } from "../../store/reducers/translations-reducer";
import { selectTreatmentStudies } from "../../store/reducers/treatment-reducer";
import * as R from "ramda";
import { useTranslation } from "react-i18next";
import MultiFilter from "./common/MultiFilter";

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

const DrugsSelector: React.FC<Props> = ({ studies, onChange, value }) => {
    const { t } = useTranslation();
    const uniques = R.uniq(R.map(R.prop("DRUG_NAME"), studies)).filter(Boolean);

    const suggestions = uniques.map((drug: string) => ({
        label: t(drug),
        value: drug,
    }));

    const sortedSuggestions = R.sortBy(R.prop("label"), suggestions);

    return (
        <MultiFilter label={t("common.filters.drug")} options={sortedSuggestions} onChange={onChange} value={value} />
    );
};

export default connect(mapStateToProps, null)(DrugsSelector);
