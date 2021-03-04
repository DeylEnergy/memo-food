import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Grow from "@material-ui/core/Grow";
import SentimentSatisfiedOutlinedIcon from "@material-ui/icons/SentimentSatisfiedOutlined";
import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied";
import { useGameActor } from "../../hooks";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    gameOutcomeWrapper: {
      display: "flex",
      alignItems: "center",
    },
    gameOutcomeTitle: {
      marginLeft: theme.spacing(0.5),
    },
  })
);

function OutcomeDisplay() {
  const [state] = useGameActor();
  const classes = useStyles();

  const hasWon = state.matches("playground.gameSession.won");
  const hasLost = state.matches("playground.gameSession.lost");

  return (
    <>
      {(hasWon || hasLost) && (
        <Grow in={true} timeout={500}>
          <div className={classes.gameOutcomeWrapper}>
            {hasWon ? (
              <SentimentSatisfiedOutlinedIcon />
            ) : (
              <SentimentVeryDissatisfiedIcon />
            )}{" "}
            <div className={classes.gameOutcomeTitle}>
              You {hasWon ? "won" : "lost"}
            </div>
          </div>
        </Grow>
      )}
    </>
  );
}

export default OutcomeDisplay;
