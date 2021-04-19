import { Component } from "react";
import { State } from "../store/types";
import { connect } from "react-redux";
import i18next from "i18next";
import * as R from "ramda";
import {
  selectTranslations,
  selectTranslationsAreLoading,
} from "../store/reducers/translations-reducer";
import { fetchTranslationsRequestAction } from "../store/actions/translations-actions";
import { fetchPreventionStudiesRequest } from "../store/actions/prevention-actions";
import { fetchDiagnosisStudiesRequest } from "../store/actions/diagnosis-actions";
import { fetchInvasiveStudiesRequest } from "../store/actions/invasive-actions";
import { fetchTreatmentStudiesRequest } from "../store/actions/treatment-actions";
import { selectCountryLayerIsLoading } from "../store/reducers/country-layer-reducer";
import { fetchDistrictsRequest } from "../store/actions/district-actions";
import { fetchCountryLayerRequest } from "../store/actions/country-layer-actions";
import { fetchDataDownloadRequestAction } from "../store/actions/data-download-actions";
import { getLastUpdatedRequestAction } from "../store/actions/base-actions";

const mapStateToProps = (state: State) => ({
  translationsLoading: selectTranslationsAreLoading(state),
  countriesLoading: selectCountryLayerIsLoading(state),
  translations: selectTranslations(state),
});

const mapDispatchToProps = {
  fetchTranslations: fetchTranslationsRequestAction,
  fetchPreventionStudies: fetchPreventionStudiesRequest,
  fetchDiagnosisStudies: fetchDiagnosisStudiesRequest,
  fetchTreatmentStudies: fetchTreatmentStudiesRequest,
  fetchInvasiveStudies: fetchInvasiveStudiesRequest,
  fetchDistricts: fetchDistrictsRequest,
  fetchCountryLayer: fetchCountryLayerRequest,
  fetchDownloads: fetchDataDownloadRequestAction,
  getLastUpdated: getLastUpdatedRequestAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
export type Props = DispatchProps & StateProps;

class DataProvider extends Component<Props> {
  componentDidMount(): void {
    this.props.fetchTranslations();
    this.props.fetchPreventionStudies();
    this.props.fetchDiagnosisStudies();
    this.props.fetchTreatmentStudies();
    this.props.fetchInvasiveStudies();
    this.props.fetchCountryLayer();
    this.props.getLastUpdated();
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    if (this.props.translations.length !== prevProps.translations.length) {
      const translations = this.props.translations;
      //     .filter(
      //   translation =>
      //     translation.VALUE_ !== "NA" ||
      //     (translation.FIELD === "COUNTRY_NAME" && translation.VALUE_ === "NA")
      // );
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
      console.log(R.groupBy(R.path(["FIELD"]), translations));
    }
  }

  render() {
    return this.props.children;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DataProvider);
