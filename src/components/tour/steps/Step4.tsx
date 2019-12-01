import { Typography } from "@material-ui/core";
import React from "react";
import { Footer, StepProps } from "../MalariaTour";

export default function Step4(options: StepProps) {
  return (
    <>
      <>
        <Typography variant="body2">
          Open the filters section to chose from the challenge filters as well
          as region filters
        </Typography>
      </>
      <Footer {...options} current={4} total={9} />
    </>
  );
}
