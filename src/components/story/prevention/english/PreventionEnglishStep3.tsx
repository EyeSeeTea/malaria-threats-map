import React from "react";
import Typography from "@material-ui/core/Typography";
import {createStyles, Link, makeStyles} from "@material-ui/core";

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
          Recent and complete data on insecticide resistance are lacking for
          many countries
        </b>
      </Typography>
      <br />
      <Typography variant={"body2"}>
        <b>
          47 of 89 malaria-endemic countries reported data for 2017. There are
          relatively few data in regions other than Africa, such as South-East
          Asia. Monitoring often does not include all major vector species and
          all relevant insecticide classes.
        </b>
      </Typography>
      <br />
      <Typography variant={"body2"}>
        Up-to-date and representative data are needed for planning and
        implementation of vector control. Monitoring should be conducted in all
        malaria-endemic countries at least once per year, and should include all
        major vector species from the different eco-epidemiological zones. Tests
        should be conducted with insecticide classes that are either in use or
        planned for use in vector control.
      </Typography>
      <br />
      <Typography variant={"body2"}>
        Monitoring requirements are to be defined through a comprehensive
        national insecticide resistance monitoring and management plan.
      </Typography>
      <br />
      <Link
        href="https://www.who.int/malaria/publications/atoz/9789241512138/"
        target="_blank"
        color={"textSecondary"}
      >
        <img
          src="https://www.who.int/entity/malaria/publications/atoz/9789241512138_eng.JPG"
          alt="prevention 3"
        />
      </Link>
    </div>
  );
};
