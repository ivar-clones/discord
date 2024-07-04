import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout.tsx';
import RootLayout from './layouts/RootLayout.tsx';
import SignInPage from './pages/SignIn/SignIn.tsx';
import SignUpPage from './pages/SignUp/SignUp.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import FriendsPage from './pages/Friends/Friends.tsx';
import Chat from './pages/Chat/Chat.tsx';
import { AppStateProvider } from './store/provider.tsx';
import Settings from './pages/Settings/Settings.tsx';
import Account from './pages/Settings/pages/Account/Account.tsx';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <DashboardLayout />,
        children: [
          {
            path: 'friends',
            element: <FriendsPage />
          },
          {
            path: 'chat/:userId',
            element: <Chat />
          }
        ]
      },
      {
        path: '/settings',
        element: <Settings />,
        children: [
          {
            path: 'account',
            element: <Account />
          }
        ]
      },
      { path: '/sign-in', element: <SignInPage /> },
      { path: '/sign-up', element: <SignUpPage /> }
    ]
  }
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppStateProvider>
          <RouterProvider router={router} />
        </AppStateProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
