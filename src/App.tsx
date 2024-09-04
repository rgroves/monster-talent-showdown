import { SignInButton, UserButton } from "@clerk/clerk-react";
import { api } from "../convex/_generated/api";
import { Doc, Id } from "../convex/_generated/dataModel";
import {
  Authenticated,
  Unauthenticated,
  useQuery,
  useConvexAuth,
} from "convex/react";
import { useState } from "react";
import CreateGameControl from "./components/CreateGameControl";
import GameBoard from "./components/game-board/GameBoard";
import GameList from "./components/GameList";
import JoinGameControl from "./components/JoinGameControl";
import "./App.css";

type GameData = {
  currentJoinCode: Doc<"games">["joinCode"] | null;
  currentGameId: Id<"games"> | null;
};

export default function App() {
  const { isLoading } = useConvexAuth();
  const games = useQuery(api.games.get, isLoading ? "skip" : undefined);
  const [gameData, setGameData] = useState<GameData>({
    currentGameId: null,
    currentJoinCode: null,
  });

  const exitGameHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setGameData((prev) => ({ ...prev, currentGameId: null }));
  };

  const createGameHandler = (gameId: Id<"games">, joinCode: string) => {
    setGameData({
      currentGameId: gameId,
      currentJoinCode: joinCode,
    });
  };

  const joinGameHandler = (gameId: Id<"games">) => {
    setGameData((prev) => ({ ...prev, currentGameId: gameId }));
  };

  const activateGameHandler = (gameId: Id<"games">) => {
    setGameData((prev) => ({ ...prev, currentGameId: gameId }));
  };

  return (
    <>
      <header>
        <Unauthenticated>
          <SignInButton mode="modal" />
        </Unauthenticated>
        <Authenticated>
          <UserButton />
        </Authenticated>
      </header>
      <Authenticated>
        <main>
          <CreateGameControl
            joinCode={gameData.currentJoinCode}
            onCreate={createGameHandler}
          />

          {!gameData.currentJoinCode ? (
            <JoinGameControl onJoin={joinGameHandler} />
          ) : (
            <></>
          )}

          {games && (
            <GameList
              games={games}
              newJoinCode={gameData.currentJoinCode}
              onActivateGame={activateGameHandler}
            />
          )}
        </main>
        <GameBoard gameId={gameData.currentGameId} onExit={exitGameHandler} />
      </Authenticated>
    </>
  );
}
