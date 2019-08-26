import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import DirectionsIcon from "@material-ui/icons/Directions";
import { useTranslation } from "react-i18next";
import {
  ListItemIcon,
  ListItemText,
  ListItem,
  List,
  Typography
} from "@material-ui/core";
import InboxIcon from "@material-ui/icons/Inbox";
import DraftsIcon from "@material-ui/icons/Drafts";

import styled from "styled-components";

const LegendContainer = styled(Paper)`
  padding: 16px;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  width: 175px;
  font-size: 12px;
  background-color: rgba(255, 255, 255, 0.75) !important;
`;

const LegendEntries = styled.div`
  display: flex;
  flex-direction: column;
`;

const LegendTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
`;

const LegendFooterContainer = styled.div`
  display: flex;
  margin-top: 8px;
`;

const LegendEntry = styled.div`
  display: flex;
  align-items: center;
`;
const LegendSymbol = styled.span<{ color: string }>`
  background-color: ${props => props.color};
  border-radius: 99999px;
  width: 12px;
  height: 12px;
  margin-right: 8px;
`;
const LegendText = styled.span`
  line-height: 24px;
`;

const LegendTypography = styled(Typography)`
  font-size: 0.8rem !important;
`;

const LegendTitleTypography = styled(Typography)`
  font-size: 0.9rem !important;
`;
const LegendFooterTypography = styled(Typography)`
  font-size: 0.7rem !important;
`;

export default function Legend({}) {
  const { t } = useTranslation("common");

  return (
    <LegendContainer>
      <LegendTitleContainer>
        <LegendTitleTypography color="textPrimary" gutterBottom>
          Resistance Status
        </LegendTitleTypography>
        <LegendTypography color="textSecondary">
          (% mosquito mortality)
        </LegendTypography>
      </LegendTitleContainer>
      <LegendEntries>
        <LegendEntry>
          <LegendSymbol color="#d43501" />
          <LegendText>{"Confirmed (<90%)"}</LegendText>
        </LegendEntry>
        <LegendEntry>
          <LegendSymbol color="#ff9502" />
          <LegendText>{"Possible (90-97%)"}</LegendText>
        </LegendEntry>
        <LegendEntry>
          <LegendSymbol color="#869c66" />
          <LegendText>{"Susceptible (≥98%)"}</LegendText>
        </LegendEntry>
      </LegendEntries>
      <LegendFooterContainer>
        <LegendFooterTypography color="textSecondary">
          Most recent data shown
        </LegendFooterTypography>
      </LegendFooterContainer>
    </LegendContainer>
  );
}
