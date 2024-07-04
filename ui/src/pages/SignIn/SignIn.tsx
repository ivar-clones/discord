import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  return <SignIn afterSignInUrl="/" signUpUrl="/sign-up" />;
}
