import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import "./App.css";

export default function App() {
  const games = useQuery(api.games.get);

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
          {games?.map(({ _id, gameId, state }) => (
            <div key={_id}>
              {gameId} - [{state}]
            </div>
          ))}
        </main>
      </Authenticated>
    </>
  );
}
