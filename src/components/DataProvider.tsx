import React, { Component } from "react";
import { State } from "../store/types";
import { connect } from "react-redux";
import i18next from "i18next";
import * as R from "ramda";
import {
  selectTranslations,
  selectTranslationsAreLoading
} from "../store/reducers/translations-reducer";
import { fetchTranslationsRequestAction } from "../store/actions/translations-actions";
import { fetchPreventionStudiesRequest } from "../store/actions/prevention-actions";
import { fetchDiagnosisStudiesRequest } from "../store/actions/diagnosis-actions";
import { fetchInvasiveStudiesRequest } from "../store/actions/invasive-actions";
import { fetchTreatmentStudiesRequest } from "../store/actions/treatment-actions";

const mapStateToProps = (state: State) => ({
  translationsLoading: selectTranslationsAreLoading(state),
  translations: selectTranslations(state)
});

const mapDispatchToProps = {
  fetchTranslations: fetchTranslationsRequestAction,
  fetchPreventionStudies: fetchPreventionStudiesRequest,
  fetchDiagnosisStudies: fetchDiagnosisStudiesRequest,
  fetchTreatmentStudies: fetchTreatmentStudiesRequest,
  fetchInvasiveStudies: fetchInvasiveStudiesRequest
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

class DataProvider extends Component<Props> {
  componentDidMount(): void {
    this.props.fetchTranslations();
    this.props.fetchPreventionStudies();
    this.props.fetchDiagnosisStudies();
    this.props.fetchTreatmentStudies();
    this.props.fetchInvasiveStudies();
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    if (this.props.translations.length !== prevProps.translations.length) {
      const englishResources = this.props.translations.reduce(
        (acc, translation) => {
          return { ...acc, [translation.VALUE_]: translation.EN };
        },
        {}
      );
      const spanishResources = this.props.translations.reduce(
        (acc, translation) => {
          return { ...acc, [translation.VALUE_]: translation.ES };
        },
        {}
      );
      const frenchResources = this.props.translations.reduce(
        (acc, translation) => {
          return { ...acc, [translation.VALUE_]: translation.FR };
        },
        {}
      );
      i18next.addResourceBundle("en", "common", englishResources);
      i18next.addResourceBundle("es", "common", spanishResources);
      i18next.addResourceBundle("fr", "common", frenchResources);
      console.log(R.groupBy(R.path(["FIELD"]), this.props.translations));
    }
  }

  render() {
    const { translationsLoading } = this.props;
    return translationsLoading ? <div /> : this.props.children;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DataProvider);
