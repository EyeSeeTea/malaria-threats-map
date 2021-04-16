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
          <i>pfhrp2/3</i> gene deletions may have significant implications for
          public health
        </b>
      </Typography>
      <br />
      <Typography variant={"body2"}>
        False negative RDT results due to <i>pfhrp2/3</i> deletions can lead to
        incorrect or delayed diagnosis and threaten patient safety. The patient
        may also continue to be a source of malaria transmission until properly
        treated.
      </Typography>
      <br />
      <Typography variant={"body2"}>
        Since 2010, surveys in several settings in Africa and Asia have also
        found a varying proportion of <i>P. falciparum</i> parasites lacking the{" "}
        <i>pfhrp2</i> gene. The prevalence of this genetic mutation reportedly
        varies between and within countries. If confirmed, RDT procurement and
        case management practices need to be tailored accordingly. WHO
        recommends a change to an RDT that is not exclusively based on HRP2 for{" "}
        <i>P. falciparum</i> detection (ie. pf-pLDH) if the prevalence of false
        negative RDTs due to <i>pfhrp2</i> deletion is ≥ 5% amongst symptomatic
        patients.
      </Typography>
      <br />
      <Typography variant={"body2"}>
        <Link
          href="https://www.who.int/publications/i/item/WHO-HTM-GMP-2017.18"
          target="_blank"
          color={"textSecondary"}
        >
          Link to supporting studies.
        </Link>
      </Typography>
    </div>
  );
};
