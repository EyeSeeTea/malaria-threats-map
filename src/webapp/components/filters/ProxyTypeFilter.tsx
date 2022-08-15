import React from "react";
import { State } from "../../store/types";
import { connect } from "react-redux";
import { Translation } from "../../types/Translation";
import { useTranslation } from "react-i18next";
import { selectProxyTypes } from "../../store/reducers/translations-reducer";
import { selectPreventionFilters, selectPreventionStudies } from "../../store/reducers/prevention-reducer";
import { setProxyType } from "../../store/actions/prevention-actions";
import { logEventAction } from "../../store/actions/base-actions";
import RadioGroupFilter from "./RadioGroupFilter";

const mapStateToProps = (state: State) => ({
    studies: selectPreventionStudies(state),
    proxyTypes: selectProxyTypes(state),
    preventionFilters: selectPreventionFilters(state),
});

const mapDispatchToProps = {
    setProxyType: setProxyType,
    logEventAction: logEventAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

function ProxyTypeFilter({ proxyTypes = [], preventionFilters, setProxyType, logEventAction }: Props) {
    const { t } = useTranslation();
    const handleChange = (event: React.ChangeEvent<unknown>) => {
        const newValue = (event.target as HTMLInputElement).value;
        setProxyType(newValue);
        logEventAction({ category: "filter", action: "proxyType", label: newValue });
    };

    const suggestions: Translation[] = proxyTypes as Translation[];

    const options = suggestions
        .filter(translation => translation.VALUE_ !== "NA")
        .map(mechanism => ({
            value: mechanism.VALUE_,
            label: t(`PROXY_TYPE_${mechanism.VALUE_}`),
        }));

    console.log({ proxyTypes });
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
