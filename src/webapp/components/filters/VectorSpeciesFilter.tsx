import React from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { setInvasiveVectorSpecies } from "../../store/actions/invasive-actions";
import { selectInvasiveFilters, selectInvasiveStudiesOfDisease } from "../../store/reducers/invasive-reducer";
import MultiFilter from "./common/MultiFilter";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { Option } from "../BasicSelect";
import { InvasiveStudy } from "../../../domain/entities/InvasiveStudy";
import { getVectorSpecies } from "../../../domain/entities/VectorSpecies";
import { Source } from "../../store/actions/base-actions";
import { legacyVectorSpecies } from "../../store/vectorSpeciesUrlValues";

const mapStateToProps = (state: State) => ({
    invasiveFilters: selectInvasiveFilters(state),
    invasiveStudies: selectInvasiveStudiesOfDisease(state),
});

const mapDispatchToProps = {
    setVectorSpecies: setInvasiveVectorSpecies,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = { from: Source };
type Props = DispatchProps & StateProps & OwnProps;

/** The label of a vector species: its xMART translation, else the app's, else the value itself. */
export function getVectorSpeciesLabel(value: string): string {
    return i18next.t([`VECTOR_SPECIES.${value}`, `common.filters.vector_species_options.${value}`], {
        defaultValue: value,
    });
}

/** The map offers the species of the data; Data Download, out of scope, keeps the 5 it offered before. */
export function getVectorSpeciesOptions(studies: ReadonlyArray<InvasiveStudy>, from: Source): Option[] {
    const values = from === "map" ? getVectorSpecies(studies) : legacyVectorSpecies;

    return values.map(value => ({ label: getVectorSpeciesLabel(value), value }));
}

const VectorSpeciesFilter: React.FC<Props> = ({ invasiveFilters, invasiveStudies, setVectorSpecies, from }) => {
    const { t } = useTranslation();

    return (
        <MultiFilter
            label={t("common.filters.vector_species")}
            placeholder={t("common.filters.select_vector_species_placeholder")}
            options={getVectorSpeciesOptions(invasiveStudies, from)}
            onChange={setVectorSpecies}
            value={invasiveFilters.vectorSpecies}
            analyticsMultiFilterAction={"vectorSpecies"}
            optionsStyle={{ fontStyle: "italic" }}
        />
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(VectorSpeciesFilter);
