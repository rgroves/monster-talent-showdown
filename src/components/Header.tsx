import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";

export default function Header({}) {
  return (
    <header>
      <AuthLoading>Loading...</AuthLoading>
      <Unauthenticated>
        <SignInButton mode="modal" />
      </Unauthenticated>
      <Authenticated>
        <UserButton />
      </Authenticated>
    </header>
  );
}
