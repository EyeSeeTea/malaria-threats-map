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
          Increasing resistance underscores the urgent need for enhanced
          monitoring
        </b>
      </Typography>
      <br />
      <Typography variant={"body2"}>
        <b>
          Malaria vectors in some areas of Africa can now survive exposure to
          high concentrations of insecticides, indicating intensified
          resistance.
        </b>
      </Typography>
      <br />
      <Typography variant={"body2"}>
        Classical resistance tests measure the number of mosquitoes that survive
        exposure to a standard concentration of insecticide. However, intensity
        of resistance in survivors and the mechanisms that confer resistance are
        important. High intensity resistance warrants urgent action that should
        be guided by knowledge of the underlying resistance mechanisms.
      </Typography>
      <br />
      <Typography variant={"body2"}>
        WHO test procedures were recently extended to include bioassays that
        measure resistance intensity and metabolic mechanism involvement.
      </Typography>
      <br />
      <Link
        href="https://www.who.int/publications/i/item/9789241511575"
        target="_blank"
        color={"textSecondary"}
      >
        <img
          src="https://www.who.int/entity/malaria/publications/atoz/9789241511575_eng.JPG"
          alt="prevention 4"
        />
      </Link>
    </div>
  );
};
