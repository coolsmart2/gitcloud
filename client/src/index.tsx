import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './error-page';
import Root from './routes/root';
import './index.scss';
import OAuthCallback from './routes/oauth-callback';
import axios from 'axios';
import { RecoilRoot } from 'recoil';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/oauth-callback',
    element: <OAuthCallback />,
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

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
  </React.StrictMode>
);
