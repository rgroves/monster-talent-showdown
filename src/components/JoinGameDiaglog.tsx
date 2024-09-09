import { useState } from "react";
import { Id } from "@/../convex/_generated/dataModel";
import JoinGameForm from "@/components/JoinGameForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface IJoinGameDialogProps {
  onJoin: (gameId: Id<"games">) => void;
}
export default function JoinGameDialog({ onJoin }: IJoinGameDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const title = "Join Game";

  const formSubmitHandler = (isValidSubmission: boolean) => {
    setIsOpen(!isValidSubmission);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button className="m-4">{title}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Enter the Join Code that your competitor shared with you and click
            the Join button.
          </DialogDescription>
        </DialogHeader>
        <JoinGameForm onJoin={onJoin} onFormSubmit={formSubmitHandler} />
      </DialogContent>
    </Dialog>
  );
}
