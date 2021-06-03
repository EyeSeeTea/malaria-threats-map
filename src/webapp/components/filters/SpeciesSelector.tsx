import React from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { selectSpecies } from "../../store/reducers/translations-reducer";
import { selectPreventionStudies } from "../../store/reducers/prevention-reducer";
import * as R from "ramda";
import { useTranslation } from "react-i18next";
import MultiSelector from "./MultiSelector";

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
    const { t } = useTranslation("common");
    const uniques = R.uniq(R.map(R.prop("SPECIES"), studies)).sort();

    const suggestions: any[] = uniques.map((specie: string) => ({
        label: specie,
        value: specie,
    }));

    return (
        <MultiSelector label={t("filters.vector_species")} options={suggestions} onChange={onChange} value={value} />
    );
}

export default connect(mapStateToProps, null)(SpeciesSelector);
