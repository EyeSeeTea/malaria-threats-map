import React, { Component } from "react";
import { State } from "../store/types";
import { connect } from "react-redux";
import {
  selectTranslations,
  selectTranslationsAreLoading
} from "../malaria/translations/reducer";
import { fetchTranslationsRequestAction } from "../malaria/translations/actions";
import i18next from "i18next";

const mapStateToProps = (state: State) => ({
  translationsLoading: selectTranslationsAreLoading(state),
  translations: selectTranslations(state)
});

const mapDispatchToProps = {
  fetchTranslations: fetchTranslationsRequestAction
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

class DataProvider extends Component<Props> {
  componentDidMount(): void {
    this.props.fetchTranslations();
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    if (this.props.translations.length !== prevProps.translations.length) {
      const resources = this.props.translations.reduce((acc, translation) => {
        return { ...acc, [translation.VALUE_]: translation.EN };
      }, {});
      i18next.addResourceBundle("en", "common", resources);
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
