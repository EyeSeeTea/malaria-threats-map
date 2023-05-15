import React, { useState } from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { setInvasiveVectorSpecies } from "../../store/actions/invasive-actions";
import { selectInvasiveFilters } from "../../store/reducers/invasive-reducer";
import MultiFilter from "./common/MultiFilter";
import { useTranslation } from "react-i18next";
import i18next, { TFunction } from "i18next";

const mapStateToProps = (state: State) => ({
    invasiveFilters: selectInvasiveFilters(state),
});

const mapDispatchToProps = {
    setVectorSpecies: setInvasiveVectorSpecies,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

export const suggestions = (t: TFunction) => [
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
    {
        label: "An. stephensi (not found)",
        value: "AN_STEPHENSI_NOT_FOUND",
    },
    {
        label: t("common.filters.all"),
        value: "all",
    },
];

export const VectorSpeciesKey: { [key: string]: string } = {
    AN_STEPHENSI_TYPE_FORM: "An. stephensi type form",
    AN_STEPHENSI_MYSORENSIS: "An. stephensi mysorensis",
    AN_STEPHENSI_INTERMEDIATE_FORM: "An. stephensi intermediate form",
    AN_STEPHENSI_FORM_UNSPECIFIED: "NR",
    AN_STEPHENSI_NOT_FOUND: "An. stephensi (not found)",
};

const VectorSpeciesFilter: React.FC<Props> = ({ setVectorSpecies }) => {
    const { t } = useTranslation();
    const [species, setSpecies] = useState(["all"]);

    const changeType = (e: string[]) => {
        setSpecies(e);
        if (e.includes("all")) {
            return setVectorSpecies([]);
        } else {
            return setVectorSpecies(e);
        }
    };

    return (
        <MultiFilter
            label={t("common.filters.vector_species")}
            placeholder={t("common.filters.select_vector_species")}
            options={suggestions(t)}
            onChange={e => changeType(e)}
            value={species}
            analyticsMultiFilterAction={"vectorSpecies"}
            optionsStyle={{ fontStyle: "italic" }}
        />
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(VectorSpeciesFilter);
