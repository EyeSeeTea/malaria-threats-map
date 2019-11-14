import React, { PureComponent } from "react";
import Typography from "@material-ui/core/Typography";
import { createStyles, makeStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles(() =>
  createStyles({
    title: {
      lineHeight: 1.3
    }
  })
);

export default () => {
  const classes = useStyles({});
  return (
    <div>
      <Typography variant={"h6"} className={classes.title}>
        <b>
          Routine monitoring of the efficacy of artemisinin-based combination
          therapies (ACTs) is essential to ensure that patients receive
          effective treatment
        </b>
      </Typography>
      <br />
      <Typography variant={"body2"}>
        <b>
          WHO recommends that all malaria endemic countries conduct therapeutic
          efficacy studies at least once every two years to inform treatment
          policy.
        </b>
      </Typography>
      <br />
      <Typography variant={"body2"}>
        The selection of the recommended antimalarial drug is based on the
        medicine’s efficacy against the malaria parasite. As such, monitoring
        the therapeutic efficacy of antimalarial medicine is a fundamental
        component of malaria treatment strategies. WHO has developed a standard
        protocol for monitoring the treatment efficacy of antimalarial medicine.
      </Typography>
    </div>
  );
};
