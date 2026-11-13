import React from "react";
import { State } from "../../store/types";
import { connect } from "react-redux";
import { Translation } from "../../types/Translation";
import { useTranslation } from "react-i18next";
import { selectProxyTypes } from "../../store/reducers/translations-reducer";
import {
    selectPreventionFilters,
    selectPreventionStudiesOfMapTypeAndDisease,
} from "../../store/reducers/prevention-reducer";
import { setProxyType } from "../../store/actions/prevention-actions";
import { logEventAction } from "../../store/actions/base-actions";
import RadioGroupFilter from "./RadioGroupFilter";
import { getInvolvementMechanisms } from "../../../domain/entities/ResistanceMechanism";

const mapStateToProps = (state: State) => ({
    proxyTypes: selectProxyTypes(state),
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
    proxyTypes = [],
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

    const suggestions: Translation[] = proxyTypes as Translation[];

    const translatedCodes = suggestions.map(translation => translation.VALUE_);
    const options = getInvolvementMechanisms(translatedCodes, preventionStudiesOfMapType).map(value => ({
        value,
        label: t(`PROXY_TYPE.${value}`),
    }));

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
