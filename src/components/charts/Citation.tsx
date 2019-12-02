import { Link, Typography } from "@material-ui/core";
import * as React from "react";
import { Study } from "../../types/Malaria";

type OwnProps = {
  study: Partial<Study>;
};
type Props = OwnProps;

const isNull = (value: string) => value === "NA" || value === null || !value;
// TODO: Translations
const Citation = ({ study }: Props) => {
  return !isNull(study.CITATION_URL) ? (
    <>
      {/*<Typography variant="body2">Source:</Typography>*/}
      <Typography variant="caption">
        <Link href={study.CITATION_URL} target="_blank" color={"textSecondary"}>
          {study.CITATION_LONG || study.CITATION || study.INSTITUTION}
          {study.INSTITUTION_CITY ? `, ${study.INSTITUTION_CITY}` : ``}
        </Link>
      </Typography>
    </>
  ) : !isNull(study.INSTITUTION) ? (
    <Typography variant="caption">{study.INSTITUTION}</Typography>
  ) : (
    <Typography variant="caption">No citation data available</Typography>
  );
};

export default Citation;
