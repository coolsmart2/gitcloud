import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './error-page';
import Root from './routes/root';
import './index.scss';
import OauthCallback from './routes/oauthCallback';

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
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
