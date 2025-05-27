import React, { useCallback } from "react";
import { connect } from "react-redux";
import { setRegionAction, setSelection } from "../../store/actions/base-actions";
import { selectRegion, selectSelection } from "../../store/reducers/base-reducer";
import { State } from "../../store/types";
import { Translation } from "../../types/Translation";
import { selectRegions } from "../../store/reducers/translations-reducer";
import { sendAnalytics } from "../../utils/analytics";
import { useTranslation } from "react-i18next";
import SingleFilter from "./common/SingleFilter";
import { Option } from "../BasicSelect";
import { resetSelectionInFeatures } from "../layers/effects";
import mapboxgl from "mapbox-gl";

const mapStateToProps = (state: State) => ({
    region: selectRegion(state),
    regions: selectRegions(state),
    selection: selectSelection(state),
});

const mapDispatchToProps = {
    setRegion: setRegionAction,
    setSelection: setSelection,
};

type OwnProps = {
    map?: mapboxgl.Map;
    layerSource?: string;
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps & OwnProps;

const RegionSelector: React.FC<Props> = ({
    region,
    regions = [],
    setRegion,
    setSelection,
    map,
    layerSource,
    selection,
}) => {
    const { t } = useTranslation();

    const onChange = useCallback(
        (regionSelected?: string) => {
            if (regionSelected)
                sendAnalytics({ type: "event", category: "geoFilter", action: "Region", label: regionSelected });
            setRegion({ region: regionSelected });
            if (map && layerSource && selection) resetSelectionInFeatures(map, layerSource, selection);
            if (selection) setSelection(null);
        },
        [layerSource, map, selection, setRegion, setSelection]
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
