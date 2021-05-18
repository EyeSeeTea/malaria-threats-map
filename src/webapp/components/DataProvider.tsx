import React, { useEffect } from "react";
import { State } from "../store/types";
import { connect } from "react-redux";
import i18next from "i18next";
import { selectTranslations } from "../store/reducers/translations-reducer";
import { fetchTranslationsRequestAction } from "../store/actions/translations-actions";
import { getLastUpdatedRequestAction } from "../store/actions/base-actions";

const mapStateToProps = (state: State) => ({
    translations: selectTranslations(state),
});

const mapDispatchToProps = {
    fetchTranslations: fetchTranslationsRequestAction,
    getLastUpdated: getLastUpdatedRequestAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const DataProvider: React.FC<Props> = ({ fetchTranslations, getLastUpdated, translations, children }) => {
    useEffect(() => {
        fetchTranslations();
        getLastUpdated();
    }, [fetchTranslations, getLastUpdated]);

    useEffect(() => {
        const englishResources = translations.reduce((acc, translation) => {
            return {
                ...acc,
                [translation.VALUE_.replace(".", "%2E")]: translation.EN,
            };
        }, {});
        const spanishResources = translations.reduce((acc, translation) => {
            return {
                ...acc,
                [translation.VALUE_.replace(".", "%2E")]: translation.ES,
            };
        }, {});
        const frenchResources = translations.reduce((acc, translation) => {
            return {
                ...acc,
                [translation.VALUE_.replace(".", "%2E")]: translation.FR,
            };
        }, {});
        i18next.addResourceBundle("en", "common", englishResources);
        i18next.addResourceBundle("es", "common", spanishResources);
        i18next.addResourceBundle("fr", "common", frenchResources);
    }, [translations]);

    return <React.Fragment>{children}</React.Fragment>;
};

export default connect(mapStateToProps, mapDispatchToProps)(DataProvider);
