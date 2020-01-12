import React, { PureComponent } from "react";
import Tour, { ReactourStep, ReactourStepContentArgs } from "reactour";
import { SiteSelection, State } from "../../store/types";
import { selectTheme, selectTour } from "../../store/reducers/base-reducer";
import { connect } from "react-redux";
import {
  logEventAction,
  setBoundsAction,
  setCountryModeAction,
  setFiltersMode,
  setFiltersOpen,
  setInitialDialogOpen,
  setRegionAction,
  setSelection,
  setThemeAction,
  setTourOpenAction,
  setTourStepAction
} from "../../store/actions/base-actions";
import { setFilteredStudiesAction } from "../../store/actions/treatment-actions";
import { Button, IconButton, withStyles } from "@material-ui/core";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import styled from "styled-components";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";
import Step5 from "./steps/Step5";
import Step6 from "./steps/Step6";
import Step7 from "./steps/Step7";
import Step8 from "./steps/Step8";
import Step9 from "./steps/Step9";
import { dispatchCustomEvent } from "../../utils/dom-utils";
import {
  setInsecticideClass,
  setInsecticideTypes,
  setSpecies
} from "../../store/actions/prevention-actions";
import Step6b from "./steps/Step6b";

const query = window.location.search.substring(1);

const styles = {
  root: {
    padding: 10
  }
};

const Flex = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
`;

const FlexGrow = styled.div`
  flex-grow: 1;
`;

const Stepper = styled.span`
  font-size: 90%;
  margin: 0 8px;
  color: rgba(0, 0, 0, 0.54);
`;

export interface StepProps extends ReactourStepContentArgs {
  step: number;
  setTourOpen?: (tourOpen: boolean) => void;
  back?: number;
  current?: number;
  total?: number;
}

export const Footer = (options: StepProps) => (
  <Flex>
    <IconButton
      component="div"
      tabIndex={-1}
      onClick={() =>
        options.goTo(options.back ? options.back : options.step - 1)
      }
      size="small"
    >
      <KeyboardArrowLeft />
    </IconButton>
    <Stepper>{`${options.current} / ${options.total}`}</Stepper>
    <IconButton
      component="div"
      tabIndex={-1}
      onClick={() => options.goTo(options.step + 1)}
      size="small"
    >
      <KeyboardArrowRight />
    </IconButton>
    <FlexGrow />
    <Button
      variant={"text"}
      tabIndex={-1}
      onClick={() => options.setTourOpen(false)}
      size="small"
    >
      Close
    </Button>
  </Flex>
);

const mapStateToProps = (state: State) => ({
  theme: selectTheme(state),
  tour: selectTour(state)
});
const mapDispatchToProps = {
  setTheme: setThemeAction,
  setTourOpen: setTourOpenAction,
  setTourStep: setTourStepAction,
  setInitialDialogOpen: setInitialDialogOpen,
  setFiltersOpen: setFiltersOpen,
  setBounds: setBoundsAction,
  setRegion: setRegionAction,
  setSelection: setSelection,
  setFiltersMode: setFiltersMode,
  setCountryMode: setCountryModeAction,
  setFilteredStudies: setFilteredStudiesAction,
  setInsecticideClass,
  setInsecticideTypes,
  setSpecies
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = { classes?: { [key: string]: string } };
type Props = DispatchProps & StateProps & OwnProps;

class MalariaTour extends PureComponent<Props> {
  state = {
    step: 0,
    visible: false
  };

  componentDidMount(): void {
    setTimeout(() => this.setState(state => ({ visible: true })), 200);
  }

  setStep = (step: number) => {
    dispatchCustomEvent("resize");
    this.props.setTourStep(step);
  };

  setTheme = (theme: string) => {
    this.props.setTheme(theme);
  };

  toggleFilters = (value: boolean) => {
    this.props.setFiltersOpen(value);
  };

  setSelection = (selection: SiteSelection | null) => {
    this.props.setSelection(selection);
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

  setInsecticideClass = (insecticideClass: string) => {
    this.props.setInsecticideClass(insecticideClass);
  };

  setInsecticideTypes = (insecticideTypes: string[]) => {
    this.props.setInsecticideTypes(insecticideTypes);
  };

  setSpecies = (species: string[]) => {
    this.props.setSpecies(species);
  };

  onClose = () => {
    this.props.setTourOpen(false);
    this.setInsecticideClass("PYRETHROIDS");
    this.setInsecticideTypes([]);
    this.setSelection(null);
    this.setCountryMode(false);
    this.toggleFilters(false);
    logEventAction({
      category: "Malaria Tour Close Event",
      action: `${this.props.tour.step}`
    });
    localStorage.setItem("tour", "visited");
  };

  render() {
    const { theme, tour, setInitialDialogOpen, classes } = this.props;

    // https://github.com/elrumordelaluz/reactour/issues/185
    setTimeout(() => {
      const elements = document.querySelectorAll(
        "div[data-focus-lock-disabled] button"
      );
      // @ts-ignore
      elements.forEach(el => (el.tabIndex = "-1"));
    }, 100);

    const baseProps = {
      setTourOpen: this.onClose
    };

    const steps: ReactourStep[] = [
      {
        selector: "#title",
        content: options => {
          setInitialDialogOpen(true);
          this.toggleFilters(false);
          return <Step1 {...options} {...baseProps} step={0} />;
        },
        // @ts-ignore
        observe: "#title"
      },
      {
        selector: "#language",
        content: options => {
          setInitialDialogOpen(true);
          this.toggleFilters(false);
          return <Step2 {...options} {...baseProps} step={1} />;
        },
        // @ts-ignore
        observe: "#language"
      },
      {
        selector: "#dialog",
        content: options => {
          setInitialDialogOpen(true);
          this.toggleFilters(false);
          return <Step3 {...options} {...baseProps} step={2} />;
        }
      },
      {
        selector: "#filters",
        content: options => {
          setInitialDialogOpen(false);
          this.setTheme("prevention");
          this.toggleFilters(false);
          return <Step4 {...options} {...baseProps} step={3} />;
        },
        // @ts-ignore
        observe: "#filters"
      },
      {
        selector: "#sidebar",
        content: ({ goTo }) => {
          setInitialDialogOpen(false);
          this.toggleFilters(true);
          this.setFiltersMode("regions");
          setTimeout(() => goTo(5), 200);
          return <div />;
        }
      },
      {
        selector: "#sidebar",
        content: options => {
          setInitialDialogOpen(false);
          this.toggleFilters(true);
          return <Step5 {...options} {...baseProps} step={5} back={2} />;
        }
      },
      {
        selector: "#sidebar",
        content: ({ goTo }) => {
          this.setFiltersMode("filters");
          setTimeout(() => goTo(7), 200);
          return <div />;
        }
      },
      {
        selector: "#sidebar",
        content: options => {
          this.setInsecticideClass("PYRETHROIDS");
          this.setInsecticideTypes([]);
          this.setSelection(null);
          return <Step6 {...options} {...baseProps} step={7} back={4} />;
        }
      },
      {
        selector: "#sidebar",
        content: options => {
          this.setInsecticideClass("CARBAMATES");
          this.setInsecticideTypes(["PROPOXUR"]);
          this.setSelection(null);
          // this.setSpecies(["An.+arabiensis", "An.+coluzzii"]);
          return <Step6b {...options} {...baseProps} step={8} back={7} />;
        }
      },
      {
        selector: "#fifth-duo",
        content: ({ goTo }) => {
          this.setCountryMode(false);
          const selection = (() => {
            switch (theme) {
              case "prevention":
                return {
                  ISO_2_CODE: "",
                  SITE_ID: "S8.600000_16.433300",
                  coordinates: [16.435546875, 8.597315884206026]
                };
              case "treatment":
                return {
                  ISO_2_CODE: "",
                  SITE_ID: "S12.036389_24.876944",
                  coordinates: [24.87579345703125, 12.036634374014696]
                };
              case "diagnosis":
                return {
                  ISO_2_CODE: "",
                  SITE_ID: "S15.642516_32.455489",
                  coordinates: [32.45635986328125, 15.6415517493066]
                };
              default:
                return null;
            }
          })();
          setTimeout(() => this.setSelection(selection as SiteSelection), 200);
          setTimeout(() => goTo(10), 300);
          return <div />;
        }
      },
      {
        selector: ".mapboxgl-popup",
        content: options => {
          return <Step7 {...options} {...baseProps} step={10} back={7} />;
        }
      },
      {
        selector: "#country-button",
        content: options => {
          this.setSelection(null);
          this.setCountryMode(true);
          return <Step8 {...options} {...baseProps} step={11} back={9} />;
        }
      },
      {
        selector: "#country-button",
        content: ({ goTo }) => {
          const selection = {
            ISO_2_CODE: "SD",
            SITE_ID: "",
            coordinates: [30.003662109375, 16.048453014179174]
          };
          setTimeout(() => this.setSelection(selection as SiteSelection), 200);
          setTimeout(() => goTo(13), 300);
          return <div />;
        }
      },
      {
        selector: ".mapboxgl-popup",
        content: options => {
          return <Step9 {...options} {...baseProps} step={13} back={11} />;
        }
      }
    ];
    const isOpen =
      tour.open && localStorage.getItem("tour") !== "visited" && !query;

    return (
      this.state.visible && (
        <Tour
          className={classes.root}
          steps={steps}
          isOpen={isOpen}
          onRequestClose={this.onClose}
          disableDotsNavigation={true}
          disableKeyboardNavigation={true}
          disableInteraction={![1].includes(tour.step)}
          showNavigation={false}
          showButtons={false}
          showNumber={false}
          showCloseButton={false}
          getCurrentStep={this.setStep}
          goToStep={tour.step}
        />
      )
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(MalariaTour));
