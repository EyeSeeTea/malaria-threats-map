import React from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { selectSpecies } from "../../store/reducers/translations-reducer";
import { selectPreventionStudies } from "../../store/reducers/prevention-reducer";
import * as R from "ramda";
import { useTranslation } from "react-i18next";
import MultiFilter from "./MultiFilter";

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

const SpeciesSelector: React.FC<Props> = ({ studies, onChange, value }) => {
    const { t } = useTranslation("common");
    const uniques = R.uniq(R.map(R.prop("SPECIES"), studies)).sort();

    const suggestions: any[] = uniques.map((specie: string) => ({
        label: specie,
        value: specie,
    }));

    return <MultiFilter label={t("filters.vector_species")} options={suggestions} onChange={onChange} value={value} />;
};

export default connect(mapStateToProps, null)(SpeciesSelector);
