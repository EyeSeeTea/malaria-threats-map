import React, { useEffect } from "react";
import { State } from "../store/types";
import { connect } from "react-redux";
import i18next from "i18next";
import { selectTranslations } from "../store/reducers/translations-reducer";
import { fetchTranslationsRequestAction } from "../store/actions/translations-actions";
import { getLastUpdatedRequestAction } from "../store/actions/base-actions";
import { getTranslationsKey } from "../types/Translation";

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

    //Currently we are set dynamic translations in i18next using the _VALUE prop of the translations as key
    //this is a problem if exists two translations with the same _VALUE prop and different FIELD prop
    //Now there are two translations for _VALUE MONO_OXYGENASES and FIELD TYPE and PROXY_TYPE
    //You can view in translations endpoint https://extranet.who.int/gis/rest/services/MALARIA/WHO_MALARIA_THREATS_MAP_STAGING/MapServer/8/query?f=json&where=1%3D1&outFields=*
    //We need refactor how dynamic translations are set in i18next, a good option is change '_VALUE' to '{FIELD}.{_VALUE}' as key, example: 'PROXY_TYPE.MONO_OXYGENASES' 'TYPE.MONO_OXYGENASES'
    //But We need refactor this using pararell change and duplicate translations, for the moment wee need to use the two strategies in i18next to avoid breaking changes
    //In the future when there are not any access to dynamic translations only by value we will can to have one strategy or when we have time for a big refactor
    //remember use '{FIELD}.{_VALUE}' as key for new components when it access to translations
    useEffect(() => {
        const englishResources = translations.reduce((acc, translation) => {
            const value = translation.VALUE_.replace(".", "%2E");

            return {
                ...acc,
                [value]: translation.EN,
                [getTranslationsKey(translation)]: translation.EN,
            };
        }, {});
        const spanishResources = translations.reduce((acc, translation) => {
            const value = translation.VALUE_.replace(".", "%2E");

            return {
                ...acc,
                [value]: translation.ES,
                [getTranslationsKey(translation)]: translation.ES,
            };
        }, {});
        const frenchResources = translations.reduce((acc, translation) => {
            const value = translation.VALUE_.replace(".", "%2E");

            return {
                ...acc,
                [value]: translation.FR,
                [getTranslationsKey(translation)]: translation.FR,
            };
        }, {});

        i18next.addResourceBundle("en", "translation", englishResources);
        i18next.addResourceBundle("es", "translation", spanishResources);
        i18next.addResourceBundle("fr", "translation", frenchResources);
    }, [translations]);

    return <React.Fragment>{children}</React.Fragment>;
};

export default connect(mapStateToProps, mapDispatchToProps)(DataProvider);
