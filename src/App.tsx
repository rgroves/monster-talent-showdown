import { api } from "../convex/_generated/api";
import { Doc, Id } from "../convex/_generated/dataModel";
import {
  Authenticated,
  useQuery,
  useConvexAuth,
  Unauthenticated,
} from "convex/react";
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
          {shouldRenderCreateGameControl && (
            <CreateGameControl
              joinCode={gameData.currentJoinCode}
              onCreate={createGameHandler}
            />
          )}

          {shouldRenderWaitingForJoinControl && gameData.currentJoinCode && (
            <WaitingForJoinControl
              joinCode={gameData.currentJoinCode}
              onStopWaiting={stopWaitingHandler}
            />
          )}

          {shouldRenderJoinGameDialog && (
            <JoinGameDialog onJoin={joinGameHandler} />
          )}

          {shouldRenderGamesList && (
            <GameList games={games} onActivateGame={activateGameHandler} />
          )}

          <GameBoard gameState={gameState} onExit={exitGameHandler} />
        </main>
      </Authenticated>
      <Unauthenticated>
        <div className="item-center flex flex-wrap justify-center direction-alternate">
          <p className="mx-auto my-4 max-w-prose text-pretty text-left">
            <em>Monster Talent Showdown</em> is a two-player card battle game
            where the world has been forever changed—monsters have arrived, and
            they’re real! These fantastical creatures are eager to break into
            the world of entertainment, and it’s your job as a top agent at the
            Monster Talent Agency to help them achieve stardom.
          </p>
          <img
            fetchPriority="high"
            src="./mts-splash-600w.png"
            className="h-auto max-w-full"
            alt="Image of various monsters in a playful talent battle, dressed up as dancers, singers, actors, and comedians"
          />
        </div>
      </Unauthenticated>
    </>
  );
}
