import React from "react";
import {
  createStyles,
  makeStyles,
  Theme,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { useMachine } from "@xstate/react";
import { gameMachine } from "./machines/gameMachine";
import { Board } from "./views/Board";
import { GameActorContext } from "./hooks";
import { Profile } from "./views/Profile";
import { Panel } from "./views/Panel";
import { inspect } from "@xstate/inspect";
import { IS_CYPRESS_ENVIRONMENT } from "./constants";

if (process.env.NODE_ENV === "development" && !IS_CYPRESS_ENVIRONMENT) {
  inspect({
    iframe: false,
  });
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    logo: {
      color: "#3f51b5",
      fontFamily: "'Carter One', cursive",
      marginTop: theme.spacing(2),
      marginBottom: 0,
    },
    logoHighlight: {
      color: "#f50057",
    },
    content: {
      display: "flex",
      flexDirection: "column",
      margin: `${theme.spacing(2)}px 0`,
    },
  })
);

const theme = createMuiTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 425,
      md: 768,
      lg: 1280,
      xl: 1920,
    },
  },
});

function App() {
  const [, , service] = useMachine(gameMachine, {
    devTools: true,
  });

  const classes = useStyles();

  return (
    <GameActorContext.Provider value={service}>
      <ThemeProvider theme={theme}>
        <div className={classes.root}>
          <Typography variant="h3" component="h1" className={classes.logo}>
            Memo<span className={classes.logoHighlight}>F</span>ood
          </Typography>
          <div className={classes.content}>
            <Profile />
            <Panel />
            <Board />
          </div>
        </div>
      </ThemeProvider>
    </GameActorContext.Provider>
  );
}

export default App;
