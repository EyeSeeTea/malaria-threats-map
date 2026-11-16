import React from "react";
import { State } from "../../store/types";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectProxyTypeValues } from "../../store/reducers/translations-reducer";
import {
    selectPreventionFilters,
    selectPreventionStudiesOfMapTypeAndDisease,
} from "../../store/reducers/prevention-reducer";
import { setProxyType } from "../../store/actions/prevention-actions";
import { logEventAction } from "../../store/actions/base-actions";
import RadioGroupFilter from "./RadioGroupFilter";
import { defaultMechanism, getInvolvementMechanisms } from "../../../domain/entities/ResistanceMechanism";
import { replacesValuesNotOfferedOnMap } from "../../store/diseaseMapBehaviour";
import { useReplaceValueNotOffered } from "./common/useReplaceValuesNotOffered";

const mapStateToProps = (state: State) => ({
    proxyTypeValues: selectProxyTypeValues(state),
    preventionFilters: selectPreventionFilters(state),
    preventionStudiesOfMapType: selectPreventionStudiesOfMapTypeAndDisease(state),
});

const mapDispatchToProps = {
    setProxyType: setProxyType,
    logEventAction: logEventAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

function ProxyTypeFilter({
    proxyTypeValues,
    preventionFilters,
    preventionStudiesOfMapType,
    setProxyType,
    logEventAction,
}: Props) {
    const { t } = useTranslation();
    const handleChange = (event: React.ChangeEvent<unknown>) => {
        const newValue = (event.target as HTMLInputElement).value;
        setProxyType(newValue);
        logEventAction({ category: "filter", action: "proxyType", label: newValue });
    };

    const mechanisms = getInvolvementMechanisms(proxyTypeValues, preventionStudiesOfMapType);
    const options = mechanisms.map(value => ({ value, label: t(`PROXY_TYPE.${value}`) }));

    useReplaceValueNotOffered(
        replacesValuesNotOfferedOnMap("map", preventionFilters.disease),
        preventionFilters.proxyType,
        mechanisms,
        defaultMechanism,
        setProxyType
    );

    return (
        <RadioGroupFilter
            label={t("common.filters.proxy_type")}
            options={options}
            handleChange={handleChange}
            value={preventionFilters.proxyType}
        />
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(ProxyTypeFilter);
