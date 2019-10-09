import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import styled from "styled-components";
import { setThemeAction } from "../store/actions/base-actions";
import { connect } from "react-redux";
import {
  diagnosisTheme,
  getTheme,
  invasiveTheme,
  preventionTheme,
  treatmentTheme
} from "../constants/theme";

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

const mapDispatchToProps = {
  setTheme: setThemeAction
};

type OwnProp = {
  title?: string;
  description?: string;
  theme?: string;
  onSelection?: () => void;
  Icon?: any;
};

type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & OwnProp;

export const SimpleCard = ({
  title,
  description,
  Icon,
  theme,
  setTheme,
  onSelection
}: Props) => {
  const classes = useStyles({});

  const styles = getTheme(theme);

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
          <ThemeProvider theme={styles}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setTheme(theme);
                onSelection();
              }}
            >
              Select Theme
            </Button>
          </ThemeProvider>
        </ButtonContainer>
      </CardActions>
    </Card>
  );
};

export default connect(
  null,
  mapDispatchToProps
)(SimpleCard);
