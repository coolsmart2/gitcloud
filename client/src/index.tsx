import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './error-page';
import Root from './routes/root';
import './index.scss';
import OauthCallback from './routes/oauth-callback';
import { User } from './types';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/oauth/callback',
    element: <OauthCallback />,
    errorElement: <ErrorPage />,
  },
  {
    path: ':username',
    element: <div>username</div>,
    children: [
      {
        path: ':reponame/:branchname?',
        element: <div>reponame</div>,
      },
    ],
  },
  {
    path: '/grandmother',
    element: <h1>할머니 생신 축하드려요!!!</h1>,
  },
]);

const UserContext = createContext<User | null>(null);

function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
