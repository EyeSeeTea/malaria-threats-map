import * as React from "react";
import { Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Study } from "../types/Malaria";

const Margin = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
`;

type OwnProps = {
  study: Partial<Study>;
};
type Props = OwnProps;

const isNull = (value: string) => value === "NA" || value === null || !value;
// TODO: Translations
const Curation = ({ study }: Props) => {
  const { t } = useTranslation("common");
  return !isNull(study.CITATION_URL) ? (
    <Margin>
      <Typography variant="body2">
        <b>{t("invasive.chart.vector_occurrance.data_collection")}:</b>
      </Typography>
      <Typography variant="body2">
        {study.INSTITUTE_CURATION || study.CURATION}
      </Typography>
    </Margin>
  ) : (
    <div />
  );
};

export default Curation;
