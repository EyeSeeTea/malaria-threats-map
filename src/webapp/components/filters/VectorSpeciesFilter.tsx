import React from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { setInvasiveVectorSpecies } from "../../store/actions/invasive-actions";
import { selectInvasiveFilters, selectInvasiveStudies } from "../../store/reducers/invasive-reducer";
import MultiFilter from "./common/MultiFilter";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { Option } from "../BasicSelect";
import { InvasiveStudy } from "../../../domain/entities/InvasiveStudy";
import { getVectorSpecies } from "../../../domain/entities/VectorSpecies";

const mapStateToProps = (state: State) => ({
    invasiveFilters: selectInvasiveFilters(state),
    invasiveStudies: selectInvasiveStudies(state),
});

const mapDispatchToProps = {
    setVectorSpecies: setInvasiveVectorSpecies,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

/** The label of a vector species: its xMART translation, else the app's, else the value itself. */
export function getVectorSpeciesLabel(value: string): string {
    return i18next.t([`VECTOR_SPECIES.${value}`, `common.filters.vector_species_options.${value}`], {
        defaultValue: value,
    });
}

export function getVectorSpeciesOptions(studies: ReadonlyArray<InvasiveStudy>): Option[] {
    return getVectorSpecies(studies).map(value => ({ label: getVectorSpeciesLabel(value), value }));
}

const VectorSpeciesFilter: React.FC<Props> = ({ invasiveFilters, invasiveStudies, setVectorSpecies }) => {
    const { t } = useTranslation();

    return (
        <MultiFilter
            label={t("common.filters.vector_species")}
            placeholder={t("common.filters.select_vector_species_placeholder")}
            options={getVectorSpeciesOptions(invasiveStudies)}
            onChange={setVectorSpecies}
            value={invasiveFilters.vectorSpecies}
            analyticsMultiFilterAction={"vectorSpecies"}
            optionsStyle={{ fontStyle: "italic" }}
        />
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(VectorSpeciesFilter);
