import React from "react";
import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { PreventionIcon } from "./Icons";
import styled, { ThemeProvider } from "styled-components";
import { colors } from "../components/theme";
import { green, purple } from "@material-ui/core/colors";

const useStyles = makeStyles({
  card: {
    margin: 16,
    textAlign: "center"
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

const theme = createMuiTheme({
  palette: {
    primary: green
  }
});

export default function SimpleCard() {
  const classes = useStyles({});
  const bull = <span className={classes.bullet}>•</span>;

  return (
    <Card className={classes.card}>
      <CardContent>
        <PreventionIcon active style={{ maxWidth: "96px" }} />
        <Typography className={classes.pos} variant="h6" component="h2">
          PARASITE pfhrp2/3 GENE DELETIONS
        </Typography>
        <Typography variant="body2" component="p">
          Resistance of malaria mosquitoes to insecticides used in core
          prevention tools of treated bed nets and indoor residual sprays
          threatens vector control effectiveness
        </Typography>
      </CardContent>
      <CardActions>
        <ButtonContainer>
          <Button variant="contained" color="default">
            Theme Provider
          </Button>
        </ButtonContainer>
      </CardActions>
    </Card>
  );
}
