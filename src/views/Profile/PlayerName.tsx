import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { useGameActor } from "../../hooks";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginBottom: theme.spacing(1.5),
    },
  })
);

function PlayerName() {
  const [state, send] = useGameActor();

  const classes = useStyles();

  return (
    <form noValidate autoComplete="off" className={classes.root}>
      <TextField
        variant="filled"
        value={state?.context.playerName}
        onChange={(
          event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
        ) =>
          send({
            type: "CHANGE_PLAYER_NAME",
            payload: { value: event.target.value },
          })
        }
        label="Your name"
        required
        error={state?.context.playerName.length === 0}
      />
    </form>
  );
}

export default PlayerName;
