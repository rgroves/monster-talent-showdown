import { ClipboardCheck, ClipboardCopyIcon } from "lucide-react";
import { useClipboard } from "use-clipboard-copy";
import { Doc } from "../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { DialogContent } from "@radix-ui/react-dialog";
import { useState } from "react";

interface IWaitingForJoinControlProps {
  joinCode: Doc<"games">["joinCode"];
  onStopWaiting: () => void;
}

export default function WaitingForJoinControl({
  joinCode,
  onStopWaiting,
}: IWaitingForJoinControlProps) {
  const [isOpen, setIsOpen] = useState(true);

  const clipboard = useClipboard({
    copiedTimeout: 1000, // timeout duration in milliseconds
  });

  const title = "Start A New Game";
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          onStopWaiting();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="m-4">Back to Games List</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Copy the join code displayed below and send it to your competitor
            along with a link to this site. Your competitor will have to sign-up
            and/or sign-in and then join the game using this code.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center space-x-2">
          <div className="">
            <Label htmlFor="joinCode" className="sr-only">
              Join Code
            </Label>
            <Input
              ref={clipboard.target}
              id="joinCode"
              defaultValue={joinCode}
              readOnly
            />
          </div>
          <Button
            type="submit"
            size="sm"
            className="px-3"
            onClick={clipboard.copy}
          >
            <span className="sr-only">Copy</span>
            {clipboard.copied ?
              <ClipboardCheck className="h-4 w-4" />
            : <ClipboardCopyIcon className="h-4 w-4" />}
          </Button>
        </div>
        <p>Waiting for competitor...</p>
      </DialogContent>
    </Dialog>
  );
}
