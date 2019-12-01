import { Typography } from "@material-ui/core";
import React from "react";
import { Footer, StepProps } from "../MalariaTour";

export default function Step8(options: StepProps) {
  return (
    <>
      <>
        <Typography variant="body2">
          Click on the country view to the the number of studies performed in
          such country
        </Typography>
      </>
      <Footer {...options} current={8} total={9} />
    </>
  );
}
