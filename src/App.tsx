import { api } from "../convex/_generated/api";
import { Doc } from "../convex/_generated/dataModel";
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

export default function App() {
  const [selectedGame, setSelectedGame] = useState<Doc<"games"> | null>(null);
  const { isAuthenticated, isLoading } = useConvexAuth();

  const games = useQuery(
    api.games.get,
    !isAuthenticated || isLoading ? "skip" : undefined,
  );

  // The selectedGame value is not sourced from a reactive query so its state may be old.
  // The currentGame value pulls the selected game (by id) from the reactive games list
  // so that the most recent state of the game object can be used.
  const currentGame =
    selectedGame ? games?.find((game) => game._id === selectedGame._id) : null;

  const gameState = useQuery(
    api.gameStates.getByGameId,
    currentGame && currentGame.status === "INPROGRESS" ?
      { gameId: currentGame._id }
    : "skip",
  );

  const exitGameHandler = () => {
    setSelectedGame(null);
  };

  const createGameHandler = (game: Doc<"games">) => {
    setSelectedGame(game);
  };

  const activateGameHandler = (game: Doc<"games">) => {
    setSelectedGame(game);
  };

  const stopWaitingHandler = () => {
    setSelectedGame(null);
  };

  return (
    <>
      <Header />
      <Authenticated>
        <main>
          {!currentGame && <CreateGameControl onCreate={createGameHandler} />}

          {currentGame && currentGame.status === "JOINING" && (
            <WaitingForJoinControl
              joinCode={currentGame.joinCode}
              onStopWaiting={stopWaitingHandler}
            />
          )}

          {!currentGame && <JoinGameDialog onJoin={activateGameHandler} />}

          {!currentGame && (
            <GameList games={games} onActivateGame={activateGameHandler} />
          )}

          {currentGame && gameState && (
            <GameBoard gameState={gameState} onExit={exitGameHandler} />
          )}
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
            src="./mts-splash-600w.webp"
            width="600"
            height="343"
            className="h-auto max-w-full"
            alt="Image of various monsters in a playful talent battle, dressed up as dancers, singers, actors, and comedians"
          />
        </div>
      </Unauthenticated>
    </>
  );
}
