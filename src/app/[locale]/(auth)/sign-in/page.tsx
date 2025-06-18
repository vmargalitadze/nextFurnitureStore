import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";

import React from "react";
import CredentialsForm from "./credentialsForm";
import { auth } from "../../../../../auth";
import { redirect } from "next/navigation";
export const metadata: Metadata = {
  title: "Sign In",
};

async function page(props: {
  searchParams: Promise<{
    callbackUrl: string;
  }>;
}) {
  const { callbackUrl } = await props.searchParams;

  const session = await auth();

  if (session) {
    return redirect(callbackUrl || "/");
  }
  return (
    <div className="w-full max-w-md mt-48 mx-auto">
      <Card>
        <CardHeader className="space-y-4">
     
          <CardTitle className="text-center"> Sign In </CardTitle>
          <CardDescription className="text-center">
            {" "}
            Sign In to your account{" "}
          </CardDescription>
          <CardContent className="space-y-4">
            <CredentialsForm callbackUrl={callbackUrl} />
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}

export default page;
