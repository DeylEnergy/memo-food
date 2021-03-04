import { Machine, assign } from "xstate";
import { v4 as uuidv4 } from "uuid";
import { boardMakerMachine } from "./boardMakerMachine";
import { FoodBoard, SessionStats } from "../models";
import {
  BOARD_SIZE,
  FOOD_PRESENCE_COUNT,
  MATCH_PAIR_TIMEOUT_MS,
} from "../constants";
import { addSessionStats } from "../utils";
import getSound from "../sounds/getSound";

interface GameMachineSchema {
  states: {
    audio: {
      states: {
        enabled: {};
        disabled: {};
      };
    };
    playground: {
      states: {
        profile: {};
        creatingBoard: {};
        creatingSession: {};
        gameSession: {
          states: {
            memorizing: {};
            playing: {
              states: {
                idle: {};
                selectingPair: {};
              };
            };
            won: {};
            lost: {};
          };
        };
      };
    };
  };
}

export interface GameMachineContext {
  playerName: string;
  sessionId?: string;
  pickedCard?: {
    id: number;
    label: string;
  };
  startedAt?: number;
  points: number;
  board: FoodBoard;
  stats: SessionStats[];
  error: string;
}

type ToggleAudioEvent = {
  type: "TOGGLE_AUDIO";
};

type SetupProfileEvent = {
  type: "SETUP_PROFILE";
};

type ChangePlayerNameEvent = {
  type: "CHANGE_PLAYER_NAME";
  payload: {
    value: string;
  };
};

type StartSessionEvent = {
  type: "START_SESSION";
};

type StartGameEvent = {
  type: "START_GAME";
};

type SeeProfileEvent = {
  type: "SEE_PROFILE";
};

type SelectCardEvent = {
  type: "SELECT_CARD";
  payload: {
    value: string;
  };
};

export type GameMachineEvents =
  | ToggleAudioEvent
  | SetupProfileEvent
  | ChangePlayerNameEvent
  | StartSessionEvent
  | StartGameEvent
  | SeeProfileEvent
  | SelectCardEvent;

const DEFAULT_GAME_CONTEXT = {
  playerName: "Default",
  sessionId: undefined,
  pickedCard: undefined,
  startedAt: undefined,
  points: 0,
  board: [],
  stats: [],
  error: "",
};

export const gameMachine = Machine<
  GameMachineContext,
  GameMachineSchema,
  GameMachineEvents
>(
  {
    id: "game",
    type: "parallel",
    context: DEFAULT_GAME_CONTEXT,
    states: {
      audio: {
        initial: "enabled",
        states: {
          enabled: {
            on: {
              TOGGLE_AUDIO: "disabled",
            },
          },
          disabled: {
            on: {
              TOGGLE_AUDIO: "enabled",
            },
          },
        },
      },
      playground: {
        id: "playground",
        initial: "profile",
        states: {
          profile: {
            on: {
              CHANGE_PLAYER_NAME: {
                actions: ["setPlayerName"],
              },
              START_GAME: [{ cond: "hasPlayerName", target: "creatingBoard" }],
            },
          },
          creatingBoard: {
            invoke: {
              src: boardMakerMachine,
              onDone: [
                {
                  cond: "hasBoard",
                  actions: "createBoard",
                  target: "creatingSession",
                },
                {
                  actions: "setBoardMakingError",
                  target: "profile",
                },
              ],
            },
          },
          creatingSession: {
            always: {
              actions: "createSessionId",
              target: "gameSession",
            },
          },
          gameSession: {
            id: "gameSession",
            initial: "memorizing",
            states: {
              memorizing: {
                on: {
                  START_GAME: { actions: "setStartedAt", target: "playing" },
                  SEE_PROFILE: "#playground.profile",
                },
              },
              playing: {
                initial: "idle",
                states: {
                  idle: {
                    always: {
                      cond: "hasWon",
                      target: "#gameSession.won",
                    },
                    on: {
                      SELECT_CARD: [
                        {
                          cond: "isPickedCard",
                          target: "idle",
                        },
                        {
                          actions: ["setPickedCard", "markPickedCard"],
                          target: "selectingPair",
                        },
                      ],
                    },
                  },
                  selectingPair: {
                    after: {
                      [MATCH_PAIR_TIMEOUT_MS]: "#gameSession.lost",
                    },
                    on: {
                      SELECT_CARD: [
                        {
                          cond: "isPickedCard",
                          target: "selectingPair",
                        },
                        {
                          cond: "hasMatchedCard",
                          actions: [
                            "markPickedCard",
                            "playMatchedSound",
                            "increasePoints",
                          ],
                          target: "idle",
                        },
                        {
                          actions: "markPickedCard",
                          target: "#gameSession.lost",
                        },
                      ],
                    },
                  },
                },
              },
              won: {
                entry: ["playWinnerSound", "updateStats"],
                on: {
                  SEE_PROFILE: {
                    target: "#playground.profile",
                    actions: "resetSession",
                  },
                },
              },
              lost: {
                entry: ["playLoserSound", "updateStats"],
                on: {
                  SEE_PROFILE: {
                    target: "#playground.profile",
                    actions: "resetSession",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  {
    actions: {
      setPlayerName: assign({
        playerName: (_, event: any) => event.payload.value,
      }),
      setBoardMakingError: assign({
        error: (_, event: any) => `Error: ${event.data.error}`,
      }),
      createBoard: assign({
        board: (_, event: any) => event.data.board,
      }),
      createSessionId: assign({
        sessionId: (_) => uuidv4(),
      }),
      setStartedAt: assign({ startedAt: (_) => Date.now() }),
      setPickedCard: assign({
        pickedCard: (_, { payload }: any) => ({
          id: payload.id,
          label: payload.label,
        }),
      }),
      markPickedCard: assign({
        board: (ctx, event: any) =>
          ctx.board.map((row) =>
            row.map((card) =>
              card.id === event.payload.id ? { ...card, isPicked: true } : card
            )
          ),
      }),
      increasePoints: assign({
        points: (ctx) => ctx.points + 1,
      }),
      updateStats: assign({
        stats: (ctx) => {
          const player = {
            name: ctx.playerName,
            time: Date.now() - (ctx.startedAt as number),
            sessionId: ctx.sessionId as string,
            points: ctx.points,
          };

          return addSessionStats(ctx.stats, player);
        },
      }),
      resetSession: assign((ctx) => ({
        ...DEFAULT_GAME_CONTEXT,
        playerName: ctx.playerName,
        stats: ctx.stats,
      })),
      playMatchedSound: (_, __, { state }) => {
        if (state.matches("audio.enabled")) {
          const sound = getSound("matched");
          sound?.play();
        }
      },
      playWinnerSound: (_, __, { state }) => {
        if (state.matches("audio.enabled")) {
          const sound = getSound("won");
          sound?.play();
        }
      },
      playLoserSound: (_, __, { state }) => {
        if (state.matches("audio.enabled")) {
          const sound = getSound("lost");
          sound?.play();
        }
      },
    },
    guards: {
      hasPlayerName: (ctx) => ctx.playerName.length > 0,
      hasBoard: (_, event: any) => Boolean(event.data.board),
      isPickedCard: (ctx, event: any) => {
        const flatBoard = ctx.board.flat();
        const card = flatBoard.find((card) => card.id === event.payload.id);

        return Boolean(card?.isPicked);
      },
      hasWon: (ctx) => ctx.points === BOARD_SIZE / FOOD_PRESENCE_COUNT,
      hasMatchedCard: (ctx, event: any) =>
        ctx.pickedCard?.label === event.payload.label,
    },
  }
);
