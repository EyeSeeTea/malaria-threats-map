import React from "react";
import { makeStyles, Theme, withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { useTranslation } from "react-i18next";
import { colors } from "../../constants/theme";
import { setInitialDialogOpen } from "../../store/actions/base-actions";
import { connect } from "react-redux";
import styled from "styled-components";

const useStyles = makeStyles({
  card: {
    marginTop: 16,
    padding: "16px 64px",
    maxWidth: "100%",
    textAlign: "center",
    backgroundColor: "rgba(255, 255, 255, 0.75)",
  },
  media: {
    height: 100,
  },
});

export const ColorButton = withStyles((theme: Theme) => ({
  root: {
    color: "white",
    backgroundColor: colors.treatment.N,
    "&:hover": {
      backgroundColor: colors.treatment.D1,
    },
  },
}))(Button);

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  setInitialDialogOpen: setInitialDialogOpen,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

function MekongTitle({ setInitialDialogOpen }: Props) {
  const classes = useStyles({});
  const { t } = useTranslation("mekong");

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography gutterBottom variant="h4" component="h2">
          {t("modal.title")}
        </Typography>
        <Typography variant="body1" color="textSecondary" component="p">
          {t("modal.description")}
        </Typography>
      </CardContent>
      <CardActions
        style={{
          justifyContent: "center",
          color: colors.treatment.N,
        }}
      >
        <ColorButton
          variant="contained"
          size="large"
          onClick={() => setInitialDialogOpen(false)}
        >
          {t("modal.go_to_map")}
        </ColorButton>
      </CardActions>
    </Card>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(MekongTitle);
