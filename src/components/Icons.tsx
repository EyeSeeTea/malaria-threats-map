import React from "react";
import treatmentIcon from "../assets/img/treatment.svg";
import diagnosisIcon from "../assets/img/diagnosis.svg";
import preventionIcon from "../assets/img/prevention.svg";
import invasiveIcon from "../assets/img/invasive.svg";
import invasiveBaseIcon from "../assets/img/invasive-base.svg";
import whoLogoBlueIcon from "../assets/img/who-logo-blue.svg";
import styled, { css } from "styled-components";
import { colors } from "../constants/theme";
import { SvgIcon } from "@material-ui/core";

const baseIcon = css`
  max-width: 48px;
  border-radius: 50%;
`;

type Props = { active: boolean };

const TreatmentSVG = ({ active, ...rest }: Props) => (
  <img alt="" {...rest} src={treatmentIcon} />
);

export const TreatmentIcon = styled(TreatmentSVG)`
  background-color: ${props =>
    props.active ? colors.treatment.N : "lightgrey"};
  ${baseIcon};
`;

const DiagnosisSVG = ({ active, ...rest }: Props) => (
  <img alt="" {...rest} src={diagnosisIcon} />
);
export const DiagnosisIcon = styled(DiagnosisSVG)`
  background-color: ${props =>
    props.active ? colors.diagnosis.N : "lightgrey"};
  ${baseIcon};
`;

const PreventionSVG = ({ active, ...rest }: any) => (
  <img alt="" {...rest} src={preventionIcon} />
);
export const PreventionIcon = styled(PreventionSVG)`
  background-color: ${props =>
    props.active ? colors.prevention.N : "lightgrey"};
  ${baseIcon};
`;

const InvasiveSVG = ({ active, ...rest }: Props) => (
  <img alt="" {...rest} src={active ? invasiveIcon : invasiveBaseIcon} />
);
export const InvasiveIcon = styled(InvasiveSVG)`
  background-color: ${props =>
    props.active ? colors.invasive.N : "lightgrey"};
  ${baseIcon};
`;

export const WhoLogoBlue = () => (
  <img
    alt=""
    style={{ width: "150px", color: "white" }}
    src={whoLogoBlueIcon}
  />
);

export function GlobeIcon(props: any) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M17.9,17.39C17.64,16.59 16.89,16 16,16H15V13A1,1 0 0,0 14,12H8V10H10A1,1 0 0,0 11,9V7H13A2,2 0 0,0 15,5V4.59C17.93,5.77 20,8.64 20,12C20,14.08 19.2,15.97 17.9,17.39M11,19.93C7.05,19.44 4,16.08 4,12C4,11.38 4.08,10.78 4.21,10.21L9,15V16A2,2 0 0,0 11,18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
    </SvgIcon>
  );
}
