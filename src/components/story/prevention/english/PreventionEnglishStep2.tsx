import React from "react";
import Typography from "@material-ui/core/Typography";
import { createStyles, Link, makeStyles } from "@material-ui/core";

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
          Monitoring has found that insecticide resistance is widespread in
          malaria vectors
        </b>
      </Typography>
      <br />
      <Typography variant={"body2"}>
        <b>
          65 of 89 malaria-endemic countries have reported pyrethroid resistance
          in at least one local vector since 2010
        </b>
      </Typography>
      <br />
      <Typography variant={"body2"}>
        Resistance has been found in vectors from all six WHO regions and to all
        four classes of insecticide currently used in adult malaria vector
        control. Pyrethroid resistance is most commonly tested and reported.
      </Typography>
      <br />
      <Link
        href="https://www.who.int/publications/i/item/9789241514057"
        target="_blank"
        color={"textSecondary"}
      >
        <img
          src="https://www.who.int/malaria/publications/atoz/9789241514057-eng.jpg"
          alt="prevention 2"
        />
      </Link>
    </div>
  );
};
