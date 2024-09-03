import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Id } from "../convex/_generated/dataModel";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../convex/_generated/api";
import CreateGameControl from "./components/CreateGameControl";
import JoinGameControl from "./components/JoinGameControl";
import "./App.css";
import GameBoard from "./components/game-board/GameBoard";

export default function App() {
  const games = useQuery(api.games.get);
  const [currentGameId, setCurrentGameId] = useState<Id<"games"> | null>(null);

  const exitGameHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setCurrentGameId(null);
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
          <CreateGameControl />
          <JoinGameControl />
          {games?.map(({ _id, joinCode, status }) => (
            <div key={_id}>
              {status === "INPROGRESS" ? (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentGameId(_id);
                  }}
                >
                  {joinCode} - [{status}]
                </a>
              ) : (
                `${joinCode} - [${status}]`
              )}
            </div>
          ))}
        </main>
        <GameBoard gameId={currentGameId} onExit={exitGameHandler} />
      </Authenticated>
    </>
  );
}
