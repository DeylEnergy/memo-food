import { Machine, assign } from "xstate";
import { FoodCard, FoodBoard } from "../models";
import { shuffleArray, splitRows, putFood } from "../utils";
import { BOARD_SIZE, FOOD } from "../constants";

interface CardsMakerMachineSchema {
  states: {
    initial: {};
    populatingDeck: {};
    shufflingDeck: {};
    creatingBoard: {};
    done: {};
  };
}

type Deck = FoodCard[];

export interface CardsMakerMachineContext {
  size: number;
  food: string[];
  deck: Deck;
  board?: FoodBoard;
  error: string;
}

export const boardMakerMachine = Machine<
  CardsMakerMachineContext,
  CardsMakerMachineSchema
>(
  {
    id: "boardMaker",
    initial: "initial",
    context: {
      size: BOARD_SIZE,
      food: FOOD,
      board: undefined,
      deck: [],
      error: "",
    },
    states: {
      initial: {
        always: [
          { cond: "hasCorrectSize", target: "populatingDeck" },
          { target: "done", actions: "setSizeError" },
        ],
      },
      populatingDeck: {
        always: {
          actions: "populateDeck",
          target: "shufflingDeck",
        },
      },
      shufflingDeck: {
        always: {
          actions: "shuffleDeck",
          target: "creatingBoard",
        },
      },
      creatingBoard: {
        always: {
          actions: "createBoard",
          target: "done",
        },
      },
      done: {
        type: "final",
        data: (ctx) => ({ error: ctx.error, board: ctx.board }),
      },
    },
  },
  {
    actions: {
      setSizeError: assign({
        error: (ctx) => `'${ctx.size}' is not correct board size value.`,
      }),
      populateDeck: assign({
        deck: (ctx) => putFood(ctx.food, ctx.size),
      }),
      shuffleDeck: assign({
        deck: (ctx) => shuffleArray(ctx.deck) as Deck,
      }),
      createBoard: assign({
        board: (ctx) => splitRows(ctx.deck, Math.sqrt(ctx.size)) as FoodBoard,
      }),
    },
    guards: {
      hasCorrectSize: (ctx) => {
        const rowWidth = Math.sqrt(ctx.size);

        return Number.isInteger(rowWidth);
      },
    },
  }
);
