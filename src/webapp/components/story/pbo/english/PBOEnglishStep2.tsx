import React from "react";
import Typography from "@material-ui/core/Typography";
import { createStyles, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() =>
  createStyles({
    title: {
      lineHeight: 1.3,
    },
  })
);

export default () => {
  const classes = useStyles({});
  return (
    <div>
      <Typography variant={"h6"} className={classes.title}>
        <b>Considerations for the deployment of Pyrethroid-PBO nets</b>
      </Typography>
      <br />
      <Typography variant={"body2"}>
        Deployment of pyrethroid-PBO nets must only be considered in situations
        where coverage with effective vector control (primarily LLINs or IRS)
        will not be reduced; the primary goal must remain the achievement and
        maintenance of universal coverage for all people at risk of malaria.
      </Typography>
      <br />
      <Typography variant={"body2"} className={classes.title}>
        Their deployment should be guided by whether geographical areas of
        operational relevance (e.g. districts or provinces) – rather than the
        whole country – meet the criteria specified by WHO and should be
        considered in the context of resource availability and potential for
        deployment of alternative malaria control interventions.
      </Typography>
      <br />
      <Typography variant={"body2"} className={classes.title}>
        Pyrethroid-PBO nets should not be considered a tool that can alone
        effectively manage insecticide resistance in malaria vectors.
      </Typography>
    </div>
  );
};
