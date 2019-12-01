import { Typography } from "@material-ui/core";
import React from "react";
import { Footer, StepProps } from "../MalariaTour";

export default function Step3(options: StepProps) {
  return (
    <>
      <>
        <Typography variant="body2">
          Open our interactive maps containing the latest data for the four
          challenges
        </Typography>
      </>
      <Footer {...options} current={3} total={9} />
    </>
  );
}
