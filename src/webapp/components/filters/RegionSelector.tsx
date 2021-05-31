import React, { Component } from "react";
import { connect } from "react-redux";
import { setRegionAction } from "../../store/actions/base-actions";
import { selectRegion } from "../../store/reducers/base-reducer";
import { State } from "../../store/types";
import { Translation } from "../../types/Translation";
import IntegrationReactSelect from "../BasicSelect";
import { selectRegions } from "../../store/reducers/translations-reducer";
import FormLabel from "@material-ui/core/FormLabel";
import { Divider, FilterWrapper } from "./Filters";
import T from "../../translations/T";
import { sendAnalytics } from "../../utils/analytics";
import { WithTranslation, withTranslation } from "react-i18next";

const mapStateToProps = (state: State) => ({
    region: selectRegion(state),
    regions: selectRegions(state),
});

const mapDispatchToProps = {
    setRegion: setRegionAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps & WithTranslation;

class RegionSelector extends Component<Props> {
    onChange = (selection: any) => {
        const label = selection ? selection.value : undefined;
        if (label) sendAnalytics({ type: "event", category: "geoFilter", action: "Region", label });
        this.props.setRegion({ region: selection ? selection.value : undefined });
    };
    render() {
        const { region, regions = [] } = this.props;
        const suggestions: any[] = (regions as Translation[]).map(region => ({
            label: localStorage.getItem("language") === "en" ? region.EN : localStorage.getItem("language") === "es" ? region.ES : region.FR,
            value: region.VALUE_,
        }));

        return (
            <FilterWrapper>
                <FormLabel component="legend">
                    <T i18nKey={"common.filters.region"} />
                </FormLabel>
                <Divider />
                <IntegrationReactSelect
                    isClearable
                    placeholder={this.props.t("common.filters.select_region")}
                    suggestions={suggestions}
                    onChange={this.onChange}
                    value={suggestions.find((s: any) => s.value === region.region) || null}
                />
            </FilterWrapper>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(RegionSelector));
