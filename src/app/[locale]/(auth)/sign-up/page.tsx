import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";


import { auth } from "../../../../../auth";
import { redirect } from "next/navigation";
import SignupForm from "./signupForm";

export const metadata: Metadata = {
  title: "Sign Up",
};

const SignUpPage = async (props: {
  searchParams: Promise<{
    callbackUrl: string;
  }>;
}) => {
  const { callbackUrl } = await props.searchParams;
  const session = await auth();

  // If user is already authenticated, redirect to home
  if (session) {
    return redirect("/");
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="mt-[100px]">
        <CardHeader className="space-y-4">
      
          <CardTitle className="text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Enter your information below to sign up
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignupForm callbackUrl={callbackUrl} />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;
