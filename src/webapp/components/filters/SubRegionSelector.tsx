import React from "react";
import { connect } from "react-redux";
import { setRegionAction } from "../../store/actions/base-actions";
import { selectRegion } from "../../store/reducers/base-reducer";
import { State } from "../../store/types";
import { Translation } from "../../types/Translation";
import { selectSubRegions } from "../../store/reducers/translations-reducer";
import { sendAnalytics } from "../../utils/analytics";
import { useTranslation, WithTranslation, withTranslation } from "react-i18next";
import SingleFilter from "./common/SingleFilter";

const mapStateToProps = (state: State) => ({
    region: selectRegion(state),
    subRegions: selectSubRegions(state),
});

const mapDispatchToProps = {
    setRegion: setRegionAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps & WithTranslation;

const SubRegionSelector: React.FC<Props> = ({ region, subRegions = [], setRegion }) => {
    const { t } = useTranslation();

    const onChange = (selection?: string) => {
        if (selection) sendAnalytics({ type: "event", category: "geoFilter", action: "subRegion", label: selection });
        setRegion({ subRegion: selection });
    };

    const suggestions: any[] = (subRegions as Translation[]).map(subRegion => ({
        label: subRegion.VALUE_,
        value: subRegion.VALUE_,
    }));

    console.log({ suggestions });

    return (
        <SingleFilter
            label={t("common.filters.sub_region")}
            placeholder={t("common.filters.select_sub_region")}
            options={suggestions}
            onChange={onChange}
            value={region.subRegion}
        />
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(SubRegionSelector));
