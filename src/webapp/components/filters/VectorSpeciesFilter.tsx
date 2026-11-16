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
import {
    getVectorSpecies,
    legacyVectorSpecies,
    legacyVectorSpeciesValues,
} from "../../../domain/entities/VectorSpecies";
import { Source } from "../../store/actions/base-actions";

const mapStateToProps = (state: State) => ({
    invasiveFilters: selectInvasiveFilters(state),
    invasiveStudies: selectInvasiveStudies(state),
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

/** Data Download offers only its 5 species, so it drops any other species selected on the map. */
export function keepVectorSpeciesOfferedOnDataDownload(selected: ReadonlyArray<string>): string[] {
    return selected.filter(species => legacyVectorSpecies.includes(species));
}

/** Analytics keep receiving the code a species had before they came from the data, so its reports do not split. */
export function getVectorSpeciesAnalyticsLabel(species: string): string {
    const legacyCode = Array.from(legacyVectorSpeciesValues.entries()).find(([, value]) => value === species)?.[0];

    return legacyCode ?? species;
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
            analyticsLabel={getVectorSpeciesAnalyticsLabel}
            optionsStyle={{ fontStyle: "italic" }}
        />
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(VectorSpeciesFilter);
