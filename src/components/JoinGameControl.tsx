import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  joinCode: z
    .string({ required_error: "Join Code is requied" })
    .length(36, "Join Code must be 36 characters"),
});

interface IJoinGameControlProps {
  shouldRender: boolean;
  onJoin: (gameId: Id<"games">) => void;
}

export default function JoinGameControl({
  shouldRender,
  onJoin,
}: IJoinGameControlProps) {
  const joinGame = useMutation(api.games.join);
  const [errorMsg, setErrorMsg] = useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      joinCode: "",
    },
  });

  if (!shouldRender) {
    return <></>;
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const gameId = await joinGame(values);
    if (gameId) {
      onJoin(gameId);
    } else {
      setErrorMsg("Invalid Join Code");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="joinCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Join A Game</FormLabel>
              <FormControl>
                <Input
                  placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter a valid join code to join a game.
              </FormDescription>
              <FormMessage>{errorMsg}</FormMessage>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
