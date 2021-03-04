import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import BarChartOutlinedIcon from "@material-ui/icons/BarChartOutlined";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import StatsTable from "./StatsTable";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      alignSelf: "center",
    },
    typography: {
      padding: theme.spacing(2),
    },
    paper: {
      padding: theme.spacing(1),
    },
    title: {
      background: "#efefef",
      borderRadius: 5,
      display: "flex",
      alignItems: "center",
      marginBottom: theme.spacing(1),
    },
  })
);

export default function SimplePopover() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "stats-popover" : undefined;

  return (
    <div>
      <Button
        variant="contained"
        size="small"
        color="primary"
        onClick={handleClick}
      >
        Stats
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          className: classes.paper,
        }}
      >
        <div className={classes.title}>
          <BarChartOutlinedIcon />
          <Typography component="h2" variant="h6">
            Stats
          </Typography>
        </div>
        <StatsTable />
      </Popover>
    </div>
  );
}
