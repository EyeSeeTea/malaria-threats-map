import { Typography } from "@material-ui/core";
import React from "react";
import { Footer, StepProps } from "../MalariaTour";

export default function Step7(options: StepProps) {
  return (
    <>
      <>
        <Typography variant="body2">
          Click on a site to see individual study result meeting your filter
          criteria. Results for one study at time are shown in the window. If
          there is more than one study meeting your criteria, you can visualize
          other study results by clicking the upper arrow.
        </Typography>
      </>
      <Footer {...options} current={7} total={9} />
    </>
  );
}
