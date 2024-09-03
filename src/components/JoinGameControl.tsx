import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

export default function JoinGameControl() {
  const joinGame = useMutation(api.games.join);
  const [joinCode, setJoinCode] = useState("");

  return (
    <>
      <div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            await joinGame({ joinCode });
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
          <button formAction="submit">Join Game</button>
        </form>
      </div>
    </>
  );
}
