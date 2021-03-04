import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { useGameActor } from "../../hooks";
import { getPassedTime, getTestId } from "../../utils";

interface Column {
  id: "name" | "points" | "time";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: "name", label: "Name", minWidth: 170 },
  {
    id: "points",
    label: "Points",
    minWidth: 100,
    align: "right",
  },
  {
    id: "time",
    label: "Time",
    minWidth: 70,
    align: "right",
    format: (value: number) => {
      const { minutes, seconds } = getPassedTime(value / 1000);

      return `${minutes}:${seconds}`;
    },
  },
];

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 440,
  },
});

function StatsTable() {
  const [state] = useGameActor();

  const classes = useStyles();

  const rows = state?.context.stats;

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table" size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row: any, id: number) => {
              return (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={id}
                  selected={
                    rows.length > 1 &&
                    row.sessionId === state?.context.sessionId
                  }
                >
                  {columns.map((column) => {
                    const value = row[column.id];
                    const testId =
                      column.id === "points" ? getTestId("player-points") : {};
                    return (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        {...testId}
                      >
                        {column.format && typeof value === "number"
                          ? column.format(value)
                          : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default StatsTable;
