import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

export default function CreateGameControl() {
  const createGame = useMutation(api.games.create);
  const [joinCode, setJoinCode] = useState("");

  if (!joinCode) {
    return (
      <>
        <div>
          <button
            onClick={async () => {
              const joinCode = await createGame();
              setJoinCode(joinCode);
            }}
          >
            Start A New Game
          </button>
        </div>
      </>
    );
  } else {
    return <p>Give this join code to your competitor: {joinCode} </p>;
  }
}
