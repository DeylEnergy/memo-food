import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import { useGameActor } from "../../hooks";
import Row from "./Row";
import {
  EXTRA_SMALL_SCREEN,
  SMALL_SCREEN,
  TABLET_SCREEN,
} from "../../constants";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minHeight: 324,
      minWidth: 324,
      display: "flex",
      flexDirection: "column",
      padding: theme.spacing(TABLET_SCREEN.BOARD_PADDING_SPACING),
      [theme.breakpoints.down("md")]: {
        padding: theme.spacing(SMALL_SCREEN.BOARD_PADDING_SPACING),
      },
      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(EXTRA_SMALL_SCREEN.BOARD_PADDING_SPACING),
      },
    },
  })
);

function Board() {
  const [state] = useGameActor();

  const classes = useStyles();

  const board = state?.context.board ?? [];

  return (
    <>
      {state?.matches("playground.gameSession") && (
        <div>
          <Grow in={board.length > 0}>
            <Paper className={classes.root} elevation={2}>
              {board.map((row, rId: number) => {
                return <Row key={`r-${rId + 1}`} row={row} rId={rId} />;
              })}
            </Paper>
          </Grow>
        </div>
      )}
    </>
  );
}

export default Board;
