"use client";

import { Button } from "@/components/ui/button";
import { Clapperboard, UserCircleIcon, UserIcon } from "lucide-react";
import React from "react";
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";

const AuthButton = () => {
  return (
    <>
      <SignedIn>
        <UserButton>
          <UserButton.MenuItems>
            <UserButton.Link
              label="My Profile"
              href="/users/current"
              labelIcon={<UserIcon className="size-4" />}
            />
            <UserButton.Link
              label="Studio"
              href="/studio"
              labelIcon={<Clapperboard className="size-4" />}
            />
            <UserButton.Action label="manageAccount" />
          </UserButton.MenuItems>
        </UserButton>
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <Button
            variant="outline"
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 border-blue-500 rounded-full shadow-none"
          >
            <UserCircleIcon />
            Sign In
          </Button>
        </SignInButton>
      </SignedOut>
    </>
  );
};

export default AuthButton;
