import { Typography } from "@material-ui/core";
import React from "react";
import { Footer, StepProps } from "../MalariaTour";

export default function Step2(options: StepProps) {
  return (
    <>
      <>
        <Typography variant="subtitle1">
          <strong>Choose a language</strong>
        </Typography>
      </>
      <Footer {...options} current={2} total={9} />
    </>
  );
}
