import React from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { setInvasiveVectorSpecies } from "../../store/actions/invasive-actions";
import { selectInvasiveFilters } from "../../store/reducers/invasive-reducer";
import MultiFilter from "./common/MultiFilter";
import { useTranslation } from "react-i18next";

const mapStateToProps = (state: State) => ({
    invasiveFilters: selectInvasiveFilters(state),
});

const mapDispatchToProps = {
    setVectorSpecies: setInvasiveVectorSpecies,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const suggestions = [
    {
        label: "An. stephensi type form",
        value: "AN_STEPHENSI_TYPE_FORM",
    },
    {
        label: "An. stephensi mysorensis",
        value: "AN_STEPHENSI_MYSORENSIS",
    },
    {
        label: "An. stephensi intermediate form",
        value: "AN_STEPHENSI_INTERMEDIATE_FORM",
    },
    {
        label: "An. stephensi form unspecified",
        value: "AN_STEPHENSI_FORM_UNSPECIFIED",
    },
];

export const VectorSpeciesKey: { [key: string]: string } = {
    AN_STEPHENSI_TYPE_FORM: "An. stephensi type form",
    AN_STEPHENSI_MYSORENSIS: "An. stephensi mysorensis",
    AN_STEPHENSI_INTERMEDIATE_FORM: "An. stephensi intermediate form",
    AN_STEPHENSI_FORM_UNSPECIFIED: "NR",
};

const VectorSpeciesFilter: React.FC<Props> = ({ invasiveFilters, setVectorSpecies }) => {
    const { t } = useTranslation("common");

    return (
        <MultiFilter
            label={t("filters.vector_species")}
            options={suggestions}
            onChange={setVectorSpecies}
            value={invasiveFilters.vectorSpecies}
            analyticsMultiFilterAction={"vectorSpecies"}
        />
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(VectorSpeciesFilter);
