import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { useGameActor } from "../../hooks";
import PlayerName from "./PlayerName";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: theme.spacing(2),
    },
    title: {
      fontSize: 20,
    },
  })
);

function Profile() {
  const [state, send] = useGameActor();
  const classes = useStyles();

  return (
    <>
      {state?.matches("playground.profile") && (
        <Grow in={true} timeout={500}>
          <Paper className={classes.root} elevation={2}>
            <Typography className={classes.title} gutterBottom>
              Player profile
            </Typography>
            <PlayerName />
            <Button
              variant="contained"
              color="primary"
              onClick={() => send("START_GAME")}
              disabled={state?.context.playerName.length === 0}
            >
              Start Game
            </Button>
          </Paper>
        </Grow>
      )}
    </>
  );
}

export default Profile;
