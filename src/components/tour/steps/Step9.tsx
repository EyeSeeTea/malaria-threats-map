import { Typography } from "@material-ui/core";
import React from "react";
import { Footer, StepProps } from "../MalariaTour";

export default function Step9(options: StepProps) {
  return (
    <>
      <>
        <Typography variant="body2">
          Click on a country to see a summary of resistance status for that
          country
        </Typography>
      </>
      <Footer {...options} current={9} total={9} />
    </>
  );
}
