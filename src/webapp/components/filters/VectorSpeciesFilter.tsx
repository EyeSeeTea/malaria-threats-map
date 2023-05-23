import React from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { setInvasiveVectorSpecies } from "../../store/actions/invasive-actions";
import { selectInvasiveFilters } from "../../store/reducers/invasive-reducer";
import MultiFilter from "./common/MultiFilter";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

const mapStateToProps = (state: State) => ({
    invasiveFilters: selectInvasiveFilters(state),
});

const mapDispatchToProps = {
    setVectorSpecies: setInvasiveVectorSpecies,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

export const suggestions = () => [
    {
        label: i18next.t("common.filters.vector_species_options.AN_STEPHENSI_TYPE_FORM"),
        value: "AN_STEPHENSI_TYPE_FORM",
    },
    {
        label: i18next.t("common.filters.vector_species_options.AN_STEPHENSI_MYSORENSIS"),
        value: "AN_STEPHENSI_MYSORENSIS",
    },
    {
        label: i18next.t("common.filters.vector_species_options.AN_STEPHENSI_INTERMEDIATE_FORM"),
        value: "AN_STEPHENSI_INTERMEDIATE_FORM",
    },
    {
        label: i18next.t("common.filters.vector_species_options.AN_STEPHENSI_FORM_UNSPECIFIED"),
        value: "AN_STEPHENSI_FORM_UNSPECIFIED",
    },
    {
        label: i18next.t("common.filters.vector_species_options.AN_STEPHENSI_NOT_FOUND"),
        value: "AN_STEPHENSI_NOT_FOUND",
    },
];

export const VectorSpeciesKey: { [key: string]: string } = {
    AN_STEPHENSI_TYPE_FORM: "An. stephensi type form",
    AN_STEPHENSI_MYSORENSIS: "An. stephensi mysorensis",
    AN_STEPHENSI_INTERMEDIATE_FORM: "An. stephensi intermediate form",
    AN_STEPHENSI_FORM_UNSPECIFIED: "NR",
    AN_STEPHENSI_NOT_FOUND: "An. stephensi (not found)",
};

const VectorSpeciesFilter: React.FC<Props> = ({ invasiveFilters, setVectorSpecies }) => {
    const { t } = useTranslation();

    return (
        <MultiFilter
            label={t("common.filters.vector_species")}
            placeholder={t("common.filters.select_vector_species")}
            options={suggestions()}
            onChange={setVectorSpecies}
            value={invasiveFilters.vectorSpecies}
            analyticsMultiFilterAction={"vectorSpecies"}
            optionsStyle={{ fontStyle: "italic" }}
        />
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(VectorSpeciesFilter);
