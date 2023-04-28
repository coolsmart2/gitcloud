import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import ErrorPage from './error-page';
import Root from './routes/root';
import OAuthCallback from './routes/oauth-callback';
import { getGitHubRepoAPI, getGitHubReposAPI } from './apis/github';
import './index.scss';

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
      const repos = await getGitHubReposAPI();
      return repos;
    },
    children: [
      {
        path: ':reponame',
        loader: async ({ params }) => {
          const { reponame } = params as { reponame: string };
          const repo = await getGitHubRepoAPI({ reponame });
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
