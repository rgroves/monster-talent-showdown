import { api } from "../convex/_generated/api";
import { Doc, Id } from "../convex/_generated/dataModel";
import { Authenticated, useQuery, useConvexAuth } from "convex/react";
import { useState } from "react";
import CreateGameControl from "./components/CreateGameControl";
import GameBoard from "./components/game-board/GameBoard";
import GameList from "./components/GameList";
import Header from "./components/Header";
import JoinGameDialog from "./components/JoinGameDiaglog";
import WaitingForJoinControl from "./components/WaitingForJoinControl";
import "./App.css";

type GameData = {
  currentJoinCode: Doc<"games">["joinCode"] | null;
  currentGameId: Id<"games"> | null;
};

export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const games = useQuery(
    api.games.get,
    !isAuthenticated || isLoading ? "skip" : undefined,
  );
  const [gameData, setGameData] = useState<GameData>({
    currentGameId: null,
    currentJoinCode: null,
  });
  const gameState = useQuery(
    api.gameStates.getByGameId,
    gameData.currentGameId ? { gameId: gameData.currentGameId } : "skip",
  );

  const exitGameHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setGameData({ currentGameId: null, currentJoinCode: null });
  };

  const createGameHandler = (gameId: Id<"games">, joinCode: string) => {
    setGameData({
      currentGameId: gameId,
      currentJoinCode: joinCode,
    });
  };

  const joinGameHandler = (gameId: Id<"games">) => {
    setGameData({ currentGameId: gameId, currentJoinCode: null });
  };

  const activateGameHandler = (gameId: Id<"games">) => {
    setGameData((prev) => ({ ...prev, currentGameId: gameId }));
  };

  const stopWaitingHandler = () => {
    setGameData({ currentGameId: null, currentJoinCode: null });
  };

  const shouldRenderCreateGameControl = gameData.currentGameId == null;
  const shouldRenderJoinGameDialog =
    gameData.currentGameId == null && gameData.currentJoinCode == null;
  const shouldRenderGamesList = gameData.currentGameId === null;
  const shouldRenderWaitingForJoinControl =
    (gameState?.playerTwoId ?? "") === "" && gameData.currentJoinCode !== null;

  return (
    <>
      <Header />
      <Authenticated>
        <main>
          <CreateGameControl
            joinCode={gameData.currentJoinCode}
            shouldRender={shouldRenderCreateGameControl}
            onCreate={createGameHandler}
          />

          {shouldRenderWaitingForJoinControl && gameData.currentJoinCode && (
            <WaitingForJoinControl
              joinCode={gameData.currentJoinCode}
              onStopWaiting={stopWaitingHandler}
            />
          )}

          <JoinGameDialog
            shouldRender={shouldRenderJoinGameDialog}
            onJoin={joinGameHandler}
          />

          <GameList
            games={games}
            newJoinCode={gameData.currentJoinCode}
            shouldRender={shouldRenderGamesList}
            onActivateGame={activateGameHandler}
          />

          <GameBoard gameState={gameState} onExit={exitGameHandler} />
        </main>
      </Authenticated>
    </>
  );
}
