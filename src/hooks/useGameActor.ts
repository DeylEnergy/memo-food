import React from "react";
import { Interpreter, ActorRef, State, Sender } from "xstate";
import { useActor } from "@xstate/react";
import { GameMachineContext, GameMachineEvents } from "../machines/gameMachine";

type ActorContextType =
  | Interpreter<GameMachineContext, any, GameMachineEvents>
  | unknown;

export const GameActorContext = React.createContext<ActorContextType>(
  undefined
);

export function useGameActor(): [
  State<GameMachineContext, GameMachineEvents>,
  Sender<GameMachineEvents>
] {
  const actorRef = React.useContext(
    GameActorContext
  ) as ActorRef<GameMachineEvents>;

  // @ts-ignore
  return useActor(actorRef);
}
