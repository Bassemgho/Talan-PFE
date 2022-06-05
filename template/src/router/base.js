import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Authenticated from 'src/components/Authenticated';
import CollapsedSidebarLayout from 'src/layouts/CollapsedSidebarLayout';

import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

// Pages

// const Overview = Loader(lazy(() => import('src/content/overview')));

// Status

const Status404 = Loader(
  lazy(() => import('src/content/pages/Status/Status404'))
);
const Status500 = Loader(
  lazy(() => import('src/content/pages/Status/Status500'))
);
const StatusComingSoon = Loader(
  lazy(() => import('src/content/pages/Status/ComingSoon'))
);
const StatusMaintenance = Loader(
  lazy(() => import('src/content/pages/Status/Maintenance'))
);
const Room = Loader(
  lazy(() => import('src/components/Room/Room'))
);

const baseRoutes = [
  {
    path: '/',
    element: <Navigate to='/extended-sidebar/' />
  },
  {
    path: 'overview',
    element: <Navigate to="/" replace />
  },
  {
    path: 'status',
    children: [
      {
        path: '/',
        element: <Navigate to="404" replace />
      },
      {
        path: '',
        element: <Status404 />
      },
      {
        path: '500',
        element: <Status500 />
      },
      {
        path: 'maintenance',
        element: <StatusMaintenance />
      },
      {
        path: 'coming-soon',
        element: <StatusComingSoon />
      }
    ]
  },
  {
    path: '*',
    element: <Status404 />
  }
];

export default baseRoutes;
