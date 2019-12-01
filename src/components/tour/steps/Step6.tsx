import { Typography } from "@material-ui/core";
import React from "react";
import { Footer, StepProps } from "../MalariaTour";

export default function Step6(options: StepProps) {
  return (
    <>
      <>
        <Typography variant="body2">
          Chose the type of data and years of your interest and click Apply.
        </Typography>
      </>
      <Footer {...options} current={6} total={9} />
    </>
  );
}
