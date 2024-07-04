import { SignUp } from '@clerk/clerk-react';

export default function SignUpPage() {
  return <SignUp afterSignInUrl='/' afterSignUpUrl='/' signInUrl='/sign-in' />;
}
