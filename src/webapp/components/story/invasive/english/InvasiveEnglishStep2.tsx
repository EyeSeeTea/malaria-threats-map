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
          Timely detection of invasive vector species is crucial to contain
          their spread.
        </b>
      </Typography>
      <br />
      <Typography variant={"body2"}>
        <b>
          Entomological surveillance systems provide critical information to
          inform the design and implementation of vector control strategies.
        </b>
      </Typography>
      <br />
      <Typography variant={"body2"}>
        Understanding vector species’ breeding and resting habitats, behaviour,
        feeding preferences and resistance status is required to design
        effective interventions to prevent further spread of invasive vector
        species and establishment in new geographical areas.
      </Typography>
      <br />
      <Typography variant={"body2"}>
        WHO recommends that all malaria endemic countries conduct entomological
        surveillance and report detection of suspected invasive species to WHO
        by filling and sending the
        <Link
          target="_blank"
          href="https://www.who.int/publications/i/item/who-form-to-report-detection-of-invasive-anopheles-vector-species"
          color={"textSecondary"}
        >
          WHO form to report detection of invasive Anopheles vector species
        </Link>
        to{" "}
        <Link href="mailto:vectorsurveillance@who.int" color={"textSecondary"}>
          vectorsurveillance@who.int
        </Link>
        .
      </Typography>
      <br />
      <Typography variant={"body2"}>
        Key indicators for entomological surveillance entomological surveillance
        are listed in chapter 5 of the
        <Link
          target="_blank"
          href="https://www.who.int/malaria/publications/atoz/9789241565578/en/"
          color={"textSecondary"}
        >
          WHO Malaria Surveillance, monitoring and evaluation: a reference
          manual
        </Link>
        .
      </Typography>
      <br />
      <Typography variant={"body2"}>
        <Link
          href="https://www.who.int/publications/i/item/9789241565578"
          target="_blank"
          color={"textSecondary"}
        >
          <img
            src="https://www.who.int/malaria/publications/atoz/978921565578-eng.jpg"
            alt="supporting"
          />
        </Link>
      </Typography>
    </div>
  );
};
