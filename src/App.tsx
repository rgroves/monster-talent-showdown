import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import "./App.css";

export default function App() {
  const games = useQuery(api.games.get);

  return (
    <>
      <header>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <main>
        {games?.map(({ _id, gameId, state }) => (
          <div key={_id}>
            {gameId} - [{state}]
          </div>
        ))}
      </main>
    </>
  );
}
