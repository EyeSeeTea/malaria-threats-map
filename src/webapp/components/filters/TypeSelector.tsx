import React from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { selectTypes } from "../../store/reducers/translations-reducer";
import { selectPreventionStudies } from "../../store/reducers/prevention-reducer";
import { useTranslation } from "react-i18next";
import MultiFilter from "./MultiFilter";

const TYPES: string[] = ["WHO_TEST_KIT_ADULTS", "CDC_BOTTLE_ADULTS"];

const mapStateToProps = (state: State) => ({
    types: selectTypes(state),
    studies: selectPreventionStudies(state),
});

type OwnProps = {
    onChange: (selection: string[]) => void;
    value: string[];
};

type StateProps = ReturnType<typeof mapStateToProps>;
type Props = StateProps & OwnProps;

function TypeSelector({ onChange, value }: Props) {
    const { t } = useTranslation("common");

    const suggestions: any[] = TYPES.map((specie: string) => ({
        label: specie,
        value: specie,
    }));

    return <MultiFilter label={t("filters.test_type")} options={suggestions} onChange={onChange} value={value} />;
}

export default connect(mapStateToProps, null)(TypeSelector);
