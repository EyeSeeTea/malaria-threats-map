import { Link, Typography } from "@material-ui/core";
import * as React from "react";
import { Study } from "../../types/Malaria";

type OwnProps = {
  study: Partial<Study>;
};
type Props = OwnProps;

// TODO: Translations
const Citation = ({ study }: Props) => {
  return study.CITATION_URL !== "NA" ? (
    <>
      {/*<Typography variant="body2">Source:</Typography>*/}
      <Typography variant="caption">
        <Link href={study.CITATION_URL} target="_blank" color={"textSecondary"}>
          {study.CITATION_LONG || study.CITATION}
        </Link>
      </Typography>
    </>
  ) : (
    <Typography variant="caption">No citation data available</Typography>
  );
};

export default Citation;
