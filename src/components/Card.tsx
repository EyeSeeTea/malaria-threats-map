import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import styled from "styled-components";
import { setThemeAction } from "../store/actions/base-actions";
import { connect } from "react-redux";

const useStyles = makeStyles({
  card: {
    margin: 8,
    maxWidth: 300,
    textAlign: "center",
    justifyContent: "flex-start",
    flexDirection: "column",
    display: "flex",
    alignItems: "center",
    cursor: "pointer"
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
    marginBottom: 12,
    width: "100%"
  },
  desc: {
    width: "100%"
  }
});

// Fix for IE11
const StyledCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  width: calc(100% - 1px);
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

  return (
    <Card
      className={classes.card}
      onClick={() => {
        setTheme(theme);
        onSelection();
      }}
    >
      <Icon active style={{ maxWidth: "96px", marginTop: "24px" }} />
      <StyledCardContent>
        <Typography className={classes.pos} variant="h6" component="h2">
          {title}
        </Typography>
        <Typography className={classes.desc} variant="body2" component="p">
          {description}
        </Typography>
      </StyledCardContent>
    </Card>
  );
};

export default connect(
  null,
  mapDispatchToProps
)(SimpleCard);
