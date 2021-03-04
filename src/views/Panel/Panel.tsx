import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import VolumeOffIcon from "@material-ui/icons/VolumeOff";
import { useGameActor } from "../../hooks";
import CountupTimer from "./CountupTimer";
import OutcomeDisplay from "./OutcomeDisplay";
import StatsPopover from "./StatsPopover";
import { getTestId } from "../../utils";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      justifyContent: "space-between",
      height: 48,
    },
    info: {
      display: "flex",
      alignItems: "center",
      marginLeft: theme.spacing(1),
    },
    handlers: {
      display: "flex",
      alignItems: "center",
    },
    startButton: {
      margin: `0 ${theme.spacing(0.5)}px`,
    },
  })
);

function Panel() {
  const [state, send] = useGameActor();

  const classes = useStyles();

  const isMemorizing = state?.matches("playground.gameSession.memorizing");

  const isPlaying = state?.matches("playground.gameSession.playing");

  const isGameOver =
    state?.matches("playground.gameSession.won") ||
    state?.matches("playground.gameSession.lost");

  return (
    <>
      {state?.matches("playground.gameSession") && (
        <div className={classes.root}>
          <div className={classes.info}>
            {isMemorizing && <>If you are ready push "Start"</>}
            {isPlaying && <CountupTimer />}
            <OutcomeDisplay />
          </div>
          <div className={classes.handlers}>
            {isGameOver && (
              <>
                <StatsPopover />
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  className={classes.startButton}
                  onClick={() => send("SEE_PROFILE")}
                  {...getTestId("new-game")}
                >
                  New game
                </Button>
              </>
            )}
            {isMemorizing && (
              <Button
                variant="contained"
                size="small"
                color="primary"
                className={classes.startButton}
                onClick={() => send("START_GAME")}
              >
                Start
              </Button>
            )}
            {isPlaying && (
              <IconButton
                color="secondary"
                aria-label="add an alarm"
                onClick={() => send("TOGGLE_AUDIO")}
              >
                {state.matches("audio.enabled") && <VolumeUpIcon />}
                {state.matches("audio.disabled") && <VolumeOffIcon />}
              </IconButton>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Panel;
