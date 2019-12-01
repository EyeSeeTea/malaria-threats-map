import React, { Component } from "react";
import Tour, { ReactourStep } from "reactour";
import { SiteSelection, State } from "../../store/types";
import { selectTour } from "../../store/reducers/base-reducer";
import { connect } from "react-redux";
import {
  setBoundsAction,
  setCountryModeAction,
  setFiltersMode,
  setFiltersOpen,
  setInitialDialogOpen,
  setRegionAction,
  setSelection,
  setTourOpenAction,
  setTourStepAction
} from "../../store/actions/base-actions";
import { setFilteredStudiesAction } from "../../store/actions/treatment-actions";
import { IconButton, makeStyles, withStyles } from "@material-ui/core";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import styled from "styled-components";

const styles = {
  root: {
    padding: 10
  }
};

const TextContainer = styled.div`
  font-size: 120%;
  & p {
    margin-bottom: 0;
  }
`;

const Flex = styled.div`
  display: flex;
`;

const Actions = styled.div`
  text-align: center;
`;

const CloseWrapper = styled.div`
  text-align: right;
  height: 4px;
`;

const Stepper = styled.span`
  font-size: 90%;
  margin: 0 8px;
  color: rgba(0, 0, 0, 0.54);
`;
const footer = ({ goTo, inDOM }: any, options = {}) => (
  <Actions>
    <IconButton
      component="div"
      tabIndex={0}
      style={{ padding: "6px" }}
      onClick={() => goTo(0)}
    >
      <KeyboardArrowLeft />
    </IconButton>
    <Stepper>...</Stepper>
    <IconButton
      component="div"
      tabIndex={0}
      style={{ padding: "6px" }}
      onClick={() => goTo(0)}
    >
      <KeyboardArrowRight />
    </IconButton>
  </Actions>
);

const mapStateToProps = (state: State) => ({
  tour: selectTour(state)
});
const mapDispatchToProps = {
  setTourOpen: setTourOpenAction,
  setTourStep: setTourStepAction,
  setInitialDialogOpen: setInitialDialogOpen,
  setFiltersOpen: setFiltersOpen,
  setBounds: setBoundsAction,
  setRegion: setRegionAction,
  setSelection: setSelection,
  setFiltersMode: setFiltersMode,
  setCountryMode: setCountryModeAction,
  setFilteredStudies: setFilteredStudiesAction
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = {};
type Props = DispatchProps & StateProps & OwnProps;

class MalariaTour extends Component<any> {
  toggleFilters = (value: boolean) => {
    this.props.setFiltersOpen(value);
  };

  setSelection = (selection: SiteSelection | null) => {
    this.props.setSelection(selection);
  };

  setBounds = () => {
    this.setSelection({
      SITE_ID: "S14.755100_5.774900",
      ISO_2_CODE: "",
      coordinates: [5.8062744140625, 15.900583912097915]
    });
  };

  setFiltersMode = (mode: string) => {
    this.props.setFiltersMode(mode);
  };

  setCountryMode = (countryMode: boolean) => {
    this.props.setCountryMode(countryMode);
  };

  setRegion = (country: string) => {
    this.props.setRegion({ country });
  };

  render() {
    const {
      tour,
      setTourOpen,
      setTourStep,
      setInitialDialogOpen,
      setBounds,
      classes
    } = this.props;

    // https://github.com/elrumordelaluz/reactour/issues/185
    setTimeout(() => {
      const elements = document.querySelectorAll(
        "div[data-focus-lock-disabled] button"
      );
      // @ts-ignore
      elements.forEach(el => (el.tabIndex = "-1"));
    }, 100);

    const steps: ReactourStep[] = [
      {
        selector: "#dialog",
        content: options => {
          setInitialDialogOpen(true);
          this.toggleFilters(false);
          return (
            <div>
              Initial Dialog
              {footer(options)}
            </div>
          );
        }
        // @ts-ignore
      },
      {
        selector: "#language",
        content: ({ goTo, inDOM }) => {
          setInitialDialogOpen(true);
          this.toggleFilters(false);
          return <div>Language</div>;
        },
        // @ts-ignore
        observe: "#language"
      },
      {
        selector: "#dialog",
        content: ({ goTo, inDOM }) => {
          setInitialDialogOpen(true);
          this.toggleFilters(false);
          return <div>Initial Dialog</div>;
        }
        // @ts-ignore
      },
      {
        selector: "#third",
        content: ({ goTo, inDOM }) => {
          setInitialDialogOpen(false);
          this.toggleFilters(false);
          return <div>This is my third</div>;
        },
        // @ts-ignore
        observe: "#third"
      },
      {
        selector: "#filters",
        content: ({ goTo, inDOM }) => {
          setInitialDialogOpen(false);
          this.toggleFilters(false);
          return <div>Filters</div>;
        },
        // @ts-ignore
        observe: "#filters"
      },
      {
        selector: "#sidebar",
        content: ({ goTo, inDOM }) => {
          setInitialDialogOpen(false);
          this.toggleFilters(true);
          setTimeout(() => goTo(6), 200);
          return <div>Sidebar</div>;
        }
      },
      {
        selector: "#regions-tab",
        content: ({ goTo, inDOM }) => {
          this.setFiltersMode("regions");
          return <div>Sidebar</div>;
        }
      },
      {
        selector: "#sidebar",
        content: ({ goTo, inDOM }) => {
          this.setFiltersMode("filters");
          setTimeout(() => goTo(8), 200);
          return <div>Language</div>;
        }
      },
      {
        selector: "#sidebar",
        content: ({ goTo, inDOM }) => {
          return <div>Language</div>;
        }
      },
      {
        selector: "#fifth-duo",
        content: ({ goTo, inDOM }) => {
          this.setCountryMode(false);
          this.setRegion("NIGER");
          this.setBounds();
          setTimeout(() => goTo(10), 100);
          return <div></div>;
        }
      },
      {
        selector: ".mapboxgl-popup",
        content: ({ goTo, inDOM }) => {
          return <div>Popup</div>;
        },
        // @ts-ignore
        observe: ".mapboxgl-popup"
      },
      {
        selector: "#country-button",
        content: ({ goTo, inDOM }) => {
          // this.setFiltered();
          this.setSelection(null);
          this.setCountryMode(true);
          return <div>Country Button</div>;
        }
      },
      {
        selector: "#country-button",
        content: ({ goTo, inDOM }) => {
          this.setSelection({
            ISO_2_CODE: "NE",
            SITE_ID: "",
            coordinates: [9.3988037109375, 17.426649169725707]
          });
          setTimeout(() => goTo(13), 100);
          return <div></div>;
        }
      },
      {
        selector: ".mapboxgl-popup",
        content: ({ goTo, inDOM }) => {
          return <div>Popup</div>;
        }
      }
    ];

    return (
      <Tour
        className={classes.root}
        steps={steps}
        isOpen={tour.open}
        onRequestClose={() => setTourOpen(!tour.open)}
        disableDotsNavigation={true}
        showNavigation={false}
        showButtons={false}
        showNumber={false}
        showCloseButton={false}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(MalariaTour));
