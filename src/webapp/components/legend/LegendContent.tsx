import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

const LegendEntries = styled.div`
    display: flex;
    flex-direction: column;
`;

const LegendEntry = styled.div`
    display: flex;
    align-items: center;
`;

const LegendSymbol = styled.span<{ color: string; border?: boolean }>`
    background-color: ${props => props.color};
    border-radius: 99999px;
    width: 12px;
    min-width: 12px;
    height: 12px;
    margin-right: 8px;
    align-self: flex-start;
    margin-top: 6px;
    border: ${props => (props.border ? "solid 1px grey" : "none")};
`;

const LegendText = styled.span`
    line-height: 24px;
`;

export interface LegendLabel {
    label: string;
    color: string;
    border?: boolean;
}

interface LegendLabelsProps {
    labels: LegendLabel[];
}

const LegendContent: React.FC<LegendLabelsProps> = ({ labels }) => {
    const { t } = useTranslation();

    return (
        <LegendEntries>
            {labels.map(label => (
                <LegendEntry key={label.label}>
                    <LegendSymbol color={label.color} border={label.border} />
                    <LegendText>{t(`common.${label.label}`)}</LegendText>
                </LegendEntry>
            ))}
        </LegendEntries>
    );
};

export default connect()(LegendContent);
