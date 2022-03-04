import React from "react";
import treatmentIcon from "../assets/img/treatment.svg";
import diagnosisIcon from "../assets/img/diagnosis.svg";
import preventionIcon from "../assets/img/prevention.svg";
import invasiveIcon from "../assets/img/invasive.svg";
import invasiveBaseIcon from "../assets/img/invasive-base.svg";
import styled, { css } from "styled-components";
import { colors } from "../constants/theme";
import { SvgIcon } from "@mui/material";

type Props = { selected?: boolean; size?: number };

const baseIcon = css<Props>`
    max-width: ${props => props.size || 48}px;
    border-radius: 50%;
`;

const TreatmentSVG = ({ ...rest }: Props) => <img alt="" {...rest} src={treatmentIcon} />;

export const TreatmentIcon = styled(TreatmentSVG)`
    background-color: ${props => (props.selected ? colors.treatment.N : "lightgrey")};
    ${baseIcon};
`;

const DiagnosisSVG = ({ ...rest }: Props) => <img alt="" {...rest} src={diagnosisIcon} />;
export const DiagnosisIcon = styled(DiagnosisSVG)`
    background-color: ${props => (props.selected ? colors.diagnosis.N : "lightgrey")};
    ${baseIcon};
`;

const PreventionSVG = ({ ...rest }: Props) => <img alt="" {...rest} src={preventionIcon} />;
export const PreventionIcon = styled(PreventionSVG)`
    background-color: ${props => (props.selected ? colors.prevention.N : "lightgrey")};
    ${baseIcon};
`;

const InvasiveSVG = ({ selected, ...rest }: Props) => (
    <img alt="" {...rest} src={selected ? invasiveIcon : invasiveBaseIcon} />
);
export const InvasiveIcon = styled(InvasiveSVG)`
    background-color: ${props => (props.selected ? colors.invasive.N : "lightgrey")};
    ${baseIcon};
`;

export function GlobeIcon(props: any) {
    return (
        <SvgIcon {...props} viewBox="0 0 24 24">
            <path d="M17.9,17.39C17.64,16.59 16.89,16 16,16H15V13A1,1 0 0,0 14,12H8V10H10A1,1 0 0,0 11,9V7H13A2,2 0 0,0 15,5V4.59C17.93,5.77 20,8.64 20,12C20,14.08 19.2,15.97 17.9,17.39M11,19.93C7.05,19.44 4,16.08 4,12C4,11.38 4.08,10.78 4.21,10.21L9,15V16A2,2 0 0,0 11,18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
        </SvgIcon>
    );
}

export function FilterIcon(props: any) {
    return (
        <SvgIcon {...props} viewBox="0 0 24 24">
            <path d="M11 11L16.76 3.62A1 1 0 0 0 16.59 2.22A1 1 0 0 0 16 2H2A1 1 0 0 0 1.38 2.22A1 1 0 0 0 1.21 3.62L7 11V16.87A1 1 0 0 0 7.29 17.7L9.29 19.7A1 1 0 0 0 10.7 19.7A1 1 0 0 0 11 18.87V11M13 16L18 21L23 16Z" />
        </SvgIcon>
    );
}

export function FilterIconSimple(props: any) {
    return (
        <SvgIcon {...props} viewBox="0 0 24 24">
            <path d="M14,12V19.88C14.04,20.18 13.94,20.5 13.71,20.71C13.32,21.1 12.69,21.1 12.3,20.71L10.29,18.7C10.06,18.47 9.96,18.16 10,17.87V12H9.97L4.21,4.62C3.87,4.19 3.95,3.56 4.38,3.22C4.57,3.08 4.78,3 5,3V3H19V3C19.22,3 19.43,3.08 19.62,3.22C20.05,3.56 20.13,4.19 19.79,4.62L14.03,12H14Z" />
        </SvgIcon>
    );
}
