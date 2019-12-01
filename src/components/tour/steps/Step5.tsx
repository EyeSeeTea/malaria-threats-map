import { Typography } from "@material-ui/core";
import React from "react";
import { Footer, StepProps } from "../MalariaTour";

export default function Step5(options: StepProps) {
  return (
    <>
      <>
        <Typography variant="body2">
          Select the country, region or sub region of your interest or leave
          this filters blank to explore all countries.
        </Typography>
      </>
      <Footer {...options} current={5} total={9} />
    </>
  );
}
