import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './error-page';
import Root from './routes/root';
import './index.scss';
import OauthCallback from './routes/oauth-callback';
import { User } from './types';
import axios from 'axios';

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
    path: '/github',
    element: <div>username</div>,
    loader: async () => {
      const { data: repos } = await axios.get(
        'http://127.0.0.1:8080/github/repos',
        {
          withCredentials: true,
        }
      );
      return repos;
    },
    children: [
      {
        path: ':reponame',
        loader: async ({ params }) => {
          const { reponame } = params;
          const { data: repo } = await axios.get(
            `http://127.0.0.1:8080/github/repos/${reponame}`,
            {
              withCredentials: true,
            }
          );
          return repo;
        },
        element: <div>reponame</div>,
      },
    ],
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
