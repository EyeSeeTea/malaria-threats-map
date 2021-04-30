import React from "react";
import Typography from "@material-ui/core/Typography";
import { createStyles, makeStyles } from "@material-ui/core";

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
          Control strategies should be informed by best practices from other
          countries, be adequately monitored and evaluated, and be modified
          where required.
        </b>
      </Typography>
      <br />
      <Typography variant={"body2"}>
        <b>
          Invasive vector species may adapt to their new environment by changing
          their traditional behaviours, including their choice of breeding
          habitats and resting sites, and may become insecticide resistant when
          exposed to vector control interventions.
        </b>
      </Typography>
      <br />
      <Typography variant={"body2"}>
        National programmes aiming to control and eliminate invasive vector
        species, should initially draw on best practices from countries where
        the species is indigenous and has been successfully controlled. However,
        due to the potential adaptive behavioural changes of vector species,
        programmes should continuously monitor and evaluate the effectiveness of
        the deployed vector control interventions to inform strategic
        adjustments when required.
      </Typography>
      <br />
      <Typography variant={"body2"}>
        National programmes aiming to control and eliminate invasive vector
        species, should initially draw on best practices from countries where
        the species is indigenous and has been successfully controlled. However,
        due to the potential adaptive behavioural changes of vector species,
        programmes should continuously monitor and evaluate the effectiveness of
        the deployed vector control interventions to inform strategic
        adjustments when required.
      </Typography>
    </div>
  );
};
