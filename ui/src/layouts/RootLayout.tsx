import { Outlet, useNavigate } from 'react-router-dom';
import { ClerkProvider, SignIn, SignedOut } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import { ThemeProvider } from '@/components/theme-provider';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

export default function RootLayout() {
  const navigate = useNavigate();

  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <ClerkProvider
        navigate={navigate}
        publishableKey={PUBLISHABLE_KEY}
        appearance={{
          baseTheme: dark,
          elements: {
            card: 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
          }
        }}
      >
        <SignedOut>
          <SignIn afterSignInUrl='/' signUpUrl='/sign-up' />
        </SignedOut>
        <main className='flex flex-row h-full w-full'>
          <Outlet />
        </main>
      </ClerkProvider>
    </ThemeProvider>
  );
}
