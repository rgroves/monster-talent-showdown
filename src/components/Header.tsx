import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { Button } from "./ui/button";
import Logo from "./Logo";

export default function Header() {
  return (
    <header className="flex items-center justify-between">
      <Logo />
      <p className="sr-only">Monster Talent Showdown</p>
      <AuthLoading>Loading...</AuthLoading>
      <Unauthenticated>
        <SignInButton mode="modal">
          <Button type="button">Sign In</Button>
        </SignInButton>
      </Unauthenticated>
      <Authenticated>
        <UserButton />
      </Authenticated>
    </header>
  );
}
