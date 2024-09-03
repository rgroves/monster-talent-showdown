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
          {games?.map(({ _id, joinCode, status }) => (
            <div key={_id}>
              {joinCode} - [{status}]
            </div>
          ))}
        </main>
      </Authenticated>
    </>
  );
}
