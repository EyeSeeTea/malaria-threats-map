import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import {
  DiagnosisIcon,
  InvasiveIcon,
  PreventionIcon,
  TreatmentIcon
} from "./Icons";
import styled from "styled-components";

const useStyles = makeStyles({
  card: {
    margin: 8,
    maxWidth: 300,
    textAlign: "center",
    justifyContent: "space-between",
    flexDirection: "column",
    display: "flex",
    alignItems: "center"
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
});

const ButtonContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
`;

const FlexGrow = styled.div`
  flex-grow: 1;
`;

const StyledCardContent = styled(CardContent)`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
`;

export const SimpleCard = ({
  title,
  description,
  Icon
}: {
  title?: string;
  description?: string;
  Icon?: any;
}) => {
  const classes = useStyles({});
  return (
    <Card className={classes.card}>
      <Icon active style={{ maxWidth: "96px", marginTop: "24px" }} />
      <StyledCardContent>
        <Typography className={classes.pos} variant="h6" component="h2">
          {title}
        </Typography>
        <Typography variant="body2" component="p">
          {description}
        </Typography>
      </StyledCardContent>
      <CardActions>
        <ButtonContainer>
          <Button variant="contained" color="default">
            Theme Provider
          </Button>
        </ButtonContainer>
      </CardActions>
    </Card>
  );
};

export const PreventionCard = () => (
  <SimpleCard
    title="VECTOR INSECTICIDE RESISTANCE"
    description="Resistance of malaria mosquitoes to insecticides used in core prevention tools of treated bed nets and indoor residual sprays threatens vector control effectiveness"
    Icon={PreventionIcon}
  />
);
export const DiagnosisCard = () => (
  <SimpleCard
    title="PARASITE pfhrp2/3 GENE DELETIONS"
    description="Gene deletions among some malaria parasites cause false negative diagnostic test results, complicating case management and control"
    Icon={DiagnosisIcon}
  />
);
export const TreatmentCard = () => (
  <SimpleCard
    title="PARASITE DRUG EFFICACY AND RESISTANCE"
    description="Resistance of malaria parasites to artemisinin – the core compound of the best available antimalarial medicines – threatens antimalarial drug efficacy"
    Icon={TreatmentIcon}
  />
);
export const InvasiveCard = () => (
  <SimpleCard
    title="INVASIVE VECTOR SPECIES"
    description=""
    Icon={InvasiveIcon}
  />
);
