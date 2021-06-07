import React from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { Translation } from "../../types/Translation";
import { selectTypes } from "../../store/reducers/translations-reducer";
import { selectPreventionFilters } from "../../store/reducers/prevention-reducer";
import { setSynergistTypes } from "../../store/actions/prevention-actions";
import MultiFilter from "./MultiFilter";
import { useTranslation } from "react-i18next";

const mapStateToProps = (state: State) => ({
    synergistTypes: selectTypes(state),
    preventionFilters: selectPreventionFilters(state),
});

const mapDispatchToProps = {
    setSynergistTypes: setSynergistTypes,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const SynergistTypeFilter: React.FC<Props> = ({ preventionFilters, synergistTypes, setSynergistTypes }) => {
    const { t } = useTranslation("common");

    const suggestions: any[] = (synergistTypes as Translation[])
        .filter(translation => ["WHO_TEST_KIT_ADULTS", "CDC_BOTTLE_ADULTS"].includes(translation.VALUE_))
        .map((country: Translation) => ({
            label: country.VALUE_,
            value: country.VALUE_,
        }));

    return (
        <MultiFilter
            label={t("filters.synergist_type")}
            options={suggestions}
            onChange={setSynergistTypes}
            value={preventionFilters.synergistTypes}
            analyticsAction={"testType"}
        />
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(SynergistTypeFilter);
