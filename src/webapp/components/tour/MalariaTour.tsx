import React, { PureComponent } from "react";
import Tour, { ReactourStep, ReactourStepContentArgs } from "reactour";
import { ActionGroup, SiteSelection, State } from "../../store/types";
import { selectTheme, selectTour } from "../../store/reducers/base-reducer";
import { connect } from "react-redux";
import {
    logEventAction,
    setActionGroupSelected,
    setBoundsAction,
    setRegionAction,
    setSelection,
    setThemeAction,
    setTourOpenAction,
    setTourStepAction,
} from "../../store/actions/base-actions";
import { setFilteredStudiesAction } from "../../store/actions/treatment-actions";
import { Button, IconButton } from "@mui/material";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import styled from "styled-components";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";
import Step5 from "./steps/Step5";
import { dispatchCustomEvent } from "../../utils/dom-utils";
import { setInsecticideClass, setInsecticideTypes, setSpecies } from "../../store/actions/prevention-actions";
import { setToLocalStorage } from "../../utils/browserCache";

const StyledTour = styled(Tour)`
    padding: 10;
`;

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

export const Footer = (options: StepProps) => {
    return (
        <Flex>
            <IconButton
                component="div"
                tabIndex={-1}
                onClick={() => {
                    options.goTo(options.back ? options.back : 0);
                }}
                size="small"
            >
                <KeyboardArrowLeft />
            </IconButton>
            <Stepper>{`${options.current} / ${options.total}`}</Stepper>
            <IconButton component="div" tabIndex={-1} onClick={() => options.goTo(options.step + 1)} size="small">
                <KeyboardArrowRight />
            </IconButton>
            <FlexGrow />
            <Button variant={"text"} tabIndex={-1} onClick={() => options.setTourOpen(false)} size="small">
                Close
            </Button>
        </Flex>
    );
};

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    tour: selectTour(state),
});
const mapDispatchToProps = {
    setTheme: setThemeAction,
    setTourOpen: setTourOpenAction,
    setTourStep: setTourStepAction,
    setBounds: setBoundsAction,
    setRegion: setRegionAction,
    setSelection: setSelection,
    setFilteredStudies: setFilteredStudiesAction,
    setInsecticideClass,
    setInsecticideTypes,
    setSpecies,
    setActionGroupSelected,
    logEvent: logEventAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = { classes?: { [key: string]: string } };
type Props = DispatchProps & StateProps & OwnProps;

class MalariaTour extends PureComponent<Props> {
    state = {
        step: 0,
        visible: false,
    };

    readonly initialBounds = [
        [-187.93572418723656, -57.24885649484118],
        [187.9357241872363, 78.02618763542307],
    ];

    readonly zambiaBounds = [
        [16.340674519230163, -19.66523734467671],
        [43.28779140779719, -5.760008504858064],
    ];

    componentDidMount(): void {
        setTimeout(() => this.setState(_state => ({ visible: true })), 200);
    }

    setStep = (step: number) => {
        dispatchCustomEvent("resize");
        this.props.setTourStep(step);
    };

    setTheme = (theme: string) => {
        this.props.setTheme(theme);
    };

    setSelection = (selection: SiteSelection | null) => {
        this.props.setSelection(selection);
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

    setActionGroupSelected = (selectGroup: ActionGroup) => {
        this.props.setActionGroupSelected(selectGroup);
    };

    setBounds = (bounds: number[][]) => {
        this.props.setBounds(bounds);
    };

    onClose = () => {
        this.setState({ open: false });
        this.setInsecticideClass("PYRETHROIDS");
        this.setInsecticideTypes([]);
        this.setSelection(null);
        this.setRegion(null);
        this.setBounds(this.initialBounds);
        this.setActionGroupSelected(null);
        setToLocalStorage("tour", "visited");
        this.props.setTourOpen(false);
    };

    render() {
        const { tour } = this.props;
        // https://github.com/elrumordelaluz/reactour/issues/185
        setTimeout(() => {
            const elements = document.querySelectorAll("div[data-focus-lock-disabled] button");
            // @ts-ignore
            elements.forEach(el => (el.tabIndex = "-1"));
        }, 100);

        const baseProps = {
            setTourOpen: this.onClose,
        };

        const steps: ReactourStep[] = [
            {
                selector: "#theme",
                action: () => {
                    this.setActionGroupSelected("THEME");
                },
                content: options => {
                    setTimeout(() => options.goTo(1), 300);
                },
            },
            {
                selector: "#theme",
                content: options => {
                    return <Step1 {...options} {...baseProps} step={1} />;
                },
                observe: "#theme",
            },
            {
                selector: "#mapType",
                action: () => {
                    this.setActionGroupSelected("MAP_TYPE");
                },
                content: options => {
                    setTimeout(() => options.goTo(3), 300);
                },
            },
            {
                selector: "#mapType",
                content: options => {
                    return <Step2 {...options} {...baseProps} step={3} back={0} />;
                },
                observe: "#mapType",
            },
            {
                selector: "#dataFilters",
                action: () => {
                    this.setActionGroupSelected("DATA");
                },
                content: options => {
                    setTimeout(() => options.goTo(5), 300);
                },
            },
            {
                selector: "#dataFilters",
                content: options => {
                    return <Step3 {...options} {...baseProps} step={5} back={2} />;
                },
                observe: "#dataFilters",
            },
            {
                selector: "#locationFilters",
                action: () => {
                    this.setActionGroupSelected("LOCATION");
                },
                content: options => {
                    setTimeout(() => options.goTo(7), 300);
                },
            },
            {
                selector: "#locationFilters",
                content: options => {
                    return <Step4 {...options} {...baseProps} step={7} back={4} />;
                },
                observe: "#locationFilters",
            },
            {
                selector: ".mapboxgl-canvas",
                content: ({ goTo }) => {
                    this.setBounds(this.zambiaBounds);
                    this.setRegion("ZM");
                    setTimeout(() => goTo(9), 300);
                },
            },
            {
                selector: ".mapboxgl-canvas",
                action: () => {
                    this.setSelection({
                        SITE_ID: "IRZM41",
                        coordinates: [-14.2333, 28.6],
                        ISO_2_CODE: "ZM",
                    });
                },
                content: options => {
                    return <Step5 {...options} {...baseProps} step={9} back={6} />;
                },
                position: "center",
                observe: ".mapboxgl-canvas",
            },
        ];

        return (
            <StyledTour
                steps={steps}
                isOpen={this.props.tour.open}
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
                className="tour-modal"
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MalariaTour);
