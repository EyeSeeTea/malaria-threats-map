import React from "react";
import * as R from "ramda";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { selectPreventionStudies } from "../../store/reducers/prevention-reducer";
import MultiFilter from "./common/MultiFilter";
import { useTranslation } from "react-i18next";

const mapStateToProps = (state: State) => ({
    studies: selectPreventionStudies(state),
});

type OwnProps = {
    onChange: (selection: string[]) => void;
    value: string[];
};

type StateProps = ReturnType<typeof mapStateToProps>;
type Props = StateProps & OwnProps;

const InsecticideTypeSelector: React.FC<Props> = ({ studies, onChange, value }) => {
    const { t } = useTranslation("common");

    const uniques = R.uniq(R.map(R.prop("INSECTICIDE_TYPE"), studies)).sort();

    const suggestions: any[] = uniques.map((specie: string) => ({
        label: specie,
        value: specie,
    }));

    return (
        <MultiFilter label={t("filters.insecticide_type")} options={suggestions} onChange={onChange} value={value} />
    );
};
export default connect(mapStateToProps, null)(InsecticideTypeSelector);
