import React from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { logEventAction } from "../../store/actions/base-actions";
import { useTranslation } from "react-i18next";
import { selectPreventionFilters } from "../../store/reducers/prevention-reducer";
import { setOnlyIncludeBioassaysWithMoreMosquitoes } from "../../store/actions/prevention-actions";
import SliderFilter from "./common/SliderFilter";

const mapStateToProps = (state: State) => ({
    preventionFilters: selectPreventionFilters(state),
});

const mapDispatchToProps = {
    setOnlyIncludeBioassaysWithMoreMosquitoes: setOnlyIncludeBioassaysWithMoreMosquitoes,
    logEventAction: logEventAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const OnlyIncludeBioassaysWithMoreMosquitoesFilter: React.FC<Props> = ({
    setOnlyIncludeBioassaysWithMoreMosquitoes,
    preventionFilters,
}) => {
    const { t } = useTranslation();

    return (
        <SliderFilter
            label={t("common.filters.onlyIncludeBioassays")}
            minLabel={t("common.filters.zero_all_bioassays")}
            maxLabel={"150+"}
            onChange={setOnlyIncludeBioassaysWithMoreMosquitoes}
            value={preventionFilters.onlyIncludeBioassaysWithMoreMosquitoes}
            min={0}
            max={150}
            analyticsFilterAction={"Only Include Bioassays With More Mosquitoes"}
        />
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(OnlyIncludeBioassaysWithMoreMosquitoesFilter);
