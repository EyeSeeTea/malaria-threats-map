import React, { useCallback } from "react";
import { connect } from "react-redux";
import { setRegionAction, setSelection } from "../../store/actions/base-actions";
import { selectRegion } from "../../store/reducers/base-reducer";
import { State } from "../../store/types";
import { Translation } from "../../types/Translation";
import { selectRegions } from "../../store/reducers/translations-reducer";
import { sendAnalytics } from "../../utils/analytics";
import { useTranslation } from "react-i18next";
import SingleFilter from "./common/SingleFilter";
import { Option } from "../BasicSelect";

const mapStateToProps = (state: State) => ({
    region: selectRegion(state),
    regions: selectRegions(state),
});

const mapDispatchToProps = {
    setRegion: setRegionAction,
    setSelection: setSelection,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const RegionSelector: React.FC<Props> = ({ region, regions = [], setRegion, setSelection }) => {
    const { t } = useTranslation();

    const onChange = useCallback(
        (selection?: string) => {
            if (selection) sendAnalytics({ type: "event", category: "geoFilter", action: "Region", label: selection });
            setRegion({ region: selection });
            setSelection(null);
        },
        [setRegion, setSelection]
    );

    const suggestions: Option[] = (regions as Translation[]).map(region => ({
        label: region.VALUE_,
        value: region.VALUE_,
    }));

    return (
        <SingleFilter
            label={t("common.filters.region")}
            placeholder={t("common.filters.select_region")}
            options={suggestions}
            onChange={onChange}
            value={region.region}
        />
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(RegionSelector);
