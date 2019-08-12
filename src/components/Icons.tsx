import React from "react";
import treatmentIcon from "../assets/img/treatment.svg";
import diagnosisIcon from "../assets/img/diagnosis.svg";
import preventionIcon from "../assets/img/prevention.svg";
import invasiveIcon from "../assets/img/invasive.svg";
import invasiveBaseIcon from "../assets/img/invasive-base.svg";
import styled, { css } from "styled-components";

const baseIcon = css`
  max-width: 48px;
  border-radius: 50%;
`;

type Props = { active: boolean };

const TreatmentSVG = ({ active, ...rest }: Props) => (
  <img {...rest} src={treatmentIcon} />
);

export const TreatmentIcon = styled(TreatmentSVG)`
  background-color: ${props => (props.active ? "#5bcdce" : "lightgrey")};
  ${baseIcon};
`;

const DiagnosisSVG = ({ active, ...rest }: Props) => (
  <img {...rest} src={diagnosisIcon} />
);
export const DiagnosisIcon = styled(DiagnosisSVG)`
  background-color: ${props => (props.active ? "#0099cc" : "lightgrey")};
  ${baseIcon};
`;

const PreventionSVG = ({ active, ...rest }: Props) => (
  <img {...rest} src={preventionIcon} />
);
export const PreventionIcon = styled(PreventionSVG)`
  background-color: ${props => (props.active ? "#5abe86" : "lightgrey")};
  ${baseIcon};
`;

const InvasiveSVG = ({ active, ...rest }: Props) => (
  <img {...rest} src={active ? invasiveIcon : invasiveBaseIcon} />
);
export const InvasiveIcon = styled(InvasiveSVG)`
  background-color: ${props => (props.active ? "#5abe86" : "lightgrey")};
  ${baseIcon};
`;
