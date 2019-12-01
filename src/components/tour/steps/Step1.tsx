import { Typography } from "@material-ui/core";
import React from "react";
import { Footer, StepProps } from "../MalariaTour";

export default function Step1(options: StepProps) {
  return (
    <>
      <>
        <Typography variant="subtitle1">
          <strong>Welcome to Malaria Threats Map!</strong>
        </Typography>
        <Typography variant="body2">
          You are at a WHO official platform created to present the magnitude
          and spread of three biological challenges for malaria control and
          elimination.
        </Typography>
        <Typography variant="body2">
          This wizard will show how to use the platform.
        </Typography>
      </>
      <Footer {...options} current={1} total={9}/>
    </>
  );
}
