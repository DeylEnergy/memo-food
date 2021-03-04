import React from "react";
import clsx from "clsx";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import { useGameActor } from "../../hooks";
import { FoodCard } from "../../models";
import getIcon from "../../icons/getIcon";
import {
  EXTRA_SMALL_SCREEN,
  SMALL_SCREEN,
  TABLET_SCREEN,
} from "../../constants";
import { getTestId } from "../../utils";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      width: "100%",
      flexGrow: 1,
    },
    card: {
      background: "#90a1ff",
      display: "flex",
      flexGrow: 1,
      margin: theme.spacing(0.25),
      padding: theme.spacing(1),
      cursor: "pointer",
      transition: "opacity ease-in-out 0.4s",
      border: "1px solid #5a73ff",
      borderRadius: 5,
      "&:hover": {
        opacity: 0.85,
      },
    },
    inactiveCard: {
      cursor: "auto",
      "&:hover": {
        opacity: 1,
      },
    },
    icon: {
      height: TABLET_SCREEN.ICON_SIZE,
      width: TABLET_SCREEN.ICON_SIZE,
      [theme.breakpoints.down("md")]: {
        height: SMALL_SCREEN.ICON_SIZE,
        width: SMALL_SCREEN.ICON_SIZE,
      },
      [theme.breakpoints.down("sm")]: {
        height: EXTRA_SMALL_SCREEN.ICON_SIZE,
        width: EXTRA_SMALL_SCREEN.ICON_SIZE,
      },
    },
  })
);

interface RowProps {
  row: FoodCard[];
  rId: number;
}

function Row({ row, rId }: RowProps) {
  const [state, send] = useGameActor();

  const classes = useStyles();

  const handleClick = (payload: any) => {
    send({ type: "SELECT_CARD", payload });
  };

  const isMemorizing = state.matches("playground.gameSession.memorizing");

  const isCardInactive =
    isMemorizing ||
    state.matches("playground.gameSession.won") ||
    state.matches("playground.gameSession.lost");

  return (
    <div className={classes.root}>
      {row.map(({ label, isPicked, id }, cId: number) => (
        <div
          key={`${rId}-${cId}`}
          className={clsx(classes.card, {
            [classes.inactiveCard]: isPicked || isCardInactive,
          })}
          onClick={() => handleClick({ label, id })}
          {...getTestId("hidden-card")}
        >
          {isMemorizing || isPicked ? (
            <Tooltip title={label}>
              {getIcon({ label, className: classes.icon })}
            </Tooltip>
          ) : (
            <span className={classes.icon}></span>
          )}
        </div>
      ))}
    </div>
  );
}

export default Row;
