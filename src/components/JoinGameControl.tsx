import { useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Button } from "./ui/button";

interface IJoinGameControlProps {
  shouldRender: boolean;
  onJoin: (gameId: Id<"games">) => void;
}

export default function JoinGameControl({
  shouldRender,
  onJoin,
}: IJoinGameControlProps) {
  const joinGame = useMutation(api.games.join);
  const [joinCode, setJoinCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!shouldRender) {
    return <></>;
  }

  return (
    <>
      <div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const gameId = await joinGame({ joinCode });
            if (gameId) {
              setJoinCode("");
              setErrorMsg("");
              onJoin(gameId);
            } else {
              setErrorMsg("Invalid Join Code");
            }
          }}
        >
          <label htmlFor="join-code">Enter Join Code:</label>
          <input
            id="join-code"
            type="text"
            onChange={(e) => {
              setJoinCode(e.target.value.trim());
            }}
            value={joinCode}
          />
          <Button formAction="submit">Join Game</Button>
          {errorMsg && <div>{errorMsg}</div>}
        </form>
      </div>
    </>
  );
}
