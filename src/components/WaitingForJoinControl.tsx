import { Doc } from "../../convex/_generated/dataModel";

interface IWaitingForJoinControlProps {
  joinCode: Doc<"games">["joinCode"] | null;
  shouldRender: boolean;
}
export default function WaitingForJoinControl({
  joinCode,
  shouldRender,
}: IWaitingForJoinControlProps) {
  if (!joinCode || !shouldRender) {
    return <></>;
  }
  return (
    <>
      <p>Send this join code to your competitor: {joinCode}</p>
      <p>Waiting for competitor...</p>
    </>
  );
}
