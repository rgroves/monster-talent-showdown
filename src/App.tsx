import { SignInButton, UserButton } from "@clerk/clerk-react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import {
  Authenticated,
  Unauthenticated,
  useQuery,
  useConvexAuth,
} from "convex/react";
import { useState } from "react";
import CreateGameControl from "./components/CreateGameControl";
import GameBoard from "./components/game-board/GameBoard";
import JoinGameControl from "./components/JoinGameControl";
import "./App.css";

type GameData = {
  currentJoinCode: string | null;
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

          {games?.map(({ _id, joinCode, status }) => (
            <div key={_id}>
              {status === "INPROGRESS" ? (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setGameData((prev) => ({ ...prev, currentGameId: _id }));
                  }}
                >
                  {joinCode} - [{status}]
                </a>
              ) : (
                `${joinCode} - [${status}]`
              )}
              {joinCode === gameData.currentJoinCode ? (
                <span>
                  {" "}
                  <sup>(New!)</sup>
                </span>
              ) : (
                <></>
              )}
            </div>
          ))}
        </main>
        <GameBoard gameId={gameData.currentGameId} onExit={exitGameHandler} />
      </Authenticated>
    </>
  );
}
