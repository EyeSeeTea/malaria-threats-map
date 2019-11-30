import React, { Component } from "react";
import Tour from "reactour";
import { Hidden } from "@material-ui/core";
import { State } from "../../store/types";
import { selectTheme, selectTour } from "../../store/reducers/base-reducer";
import { TreatmentStudy } from "../../types/Treatment";
import { connect } from "react-redux";
import {
  setTourOpenAction,
  setTourStepAction
} from "../../store/actions/base-actions";
import Joyride, { CallBackProps, Placement, STATUS, Step } from "react-joyride";

const mapStateToProps = (state: State) => ({
  tour: selectTour(state)
});
const mapDispatchToProps = {
  setTourOpen: setTourOpenAction,
  setTourStep: setTourStepAction
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = {};
type Props = DispatchProps & StateProps & OwnProps;

const steps: Step[] = [
  {
    disableBeacon: true,
    placement: "left-start",
    target: "#initial-dialog",
    content: "Initial Dialog"
  },
  {
    disableBeacon: true,
    placement: "left-start",
    target: "#language",
    content: "This is my Language"
  }
];

class MalariaTour extends Component<Props> {
  render() {
    const { tour, setTourOpen, setTourStep } = this.props;
    //
    // const handleJoyrideCallback = (data: CallBackProps) => {
    //   const { status, type } = data;
    //   const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
    //
    //   if (type === "step:after") {
    //     setTourStep(tour.step + 1);
    //   }
    //
    //   if (type === "tour:end") {
    //     setTourOpen(false);
    //   }
    //
    //   console.log(data);
    // };
    //
    // return (
    //   tour.open && (
    //     <Joyride
    //       callback={handleJoyrideCallback}
    //       continuous={true}
    //       scrollToFirstStep={true}
    //       showProgress={true}
    //       showSkipButton={false}
    //       spotlightClicks={true}
    //       styles={{
    //         options: {
    //           zIndex: 10000
    //         }
    //       }}
    //       run={tour.open}
    //       steps={steps}
    //       stepIndex={tour.step}
    //     />
    //   )
    // );

    return (
      <Tour
        steps={[
          {
            selector: "#language",
            content: "This is my Language",
            // @ts-ignore
            observe: "#language"
          }
        ]}
        isOpen={tour.open}
        onRequestClose={() => setTourOpen(!tour.open)}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MalariaTour);
