import React from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { logEventAction } from "../../store/actions/base-actions";
import { useTranslation } from "react-i18next";
import SwitchFilter from "./common/SwitchFilter";
import { selectPreventionFilters } from "../../store/reducers/prevention-reducer";
import { setOnlyByHealthMinistries } from "../../store/actions/prevention-actions";

const mapStateToProps = (state: State) => ({
    preventionFilters: selectPreventionFilters(state),
});

const mapDispatchToProps = {
    setOnlyByHealthMinistries: setOnlyByHealthMinistries,
    logEventAction: logEventAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const OnlyByHealthMinistriesFilter: React.FC<Props> = ({ setOnlyByHealthMinistries, preventionFilters }) => {
    const { t } = useTranslation();

    return (
        <SwitchFilter
            label={t("common.filters.only_include_data_by_health")}
            onChange={setOnlyByHealthMinistries}
            value={preventionFilters.onlyByHealthMinistries}
            analyticsFilterAction={"Only Data by Ministries of Health"}
        />
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(OnlyByHealthMinistriesFilter);
