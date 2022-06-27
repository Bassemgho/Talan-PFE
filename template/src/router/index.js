// import { Suspense, lazy } from 'react';
import Authenticated from 'src/components/Authenticated';
import { Navigate } from 'react-router-dom';
import Room from 'src/components/Room/Room'
import ChangePass from 'src/content/pages/ChangePass'
import ChangePassword from 'src/content/pages/Auth/ChangePassword'
import Activated from 'src/components/Activated'
// import SuspenseLoader from 'src/components/SuspenseLoader';

// import BoxedSidebarLayout from 'src/layouts/BoxedSidebarLayout';
// import DocsLayout from 'src/layouts/DocsLayout';
import BaseLayout from 'src/layouts/BaseLayout';
// import AccentHeaderLayout from 'src/layouts/AccentHeaderLayout';
// import AccentSidebarLayout from 'src/layouts/AccentSidebarLayout';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import CollapsedSidebarLayout from 'src/layouts/CollapsedSidebarLayout';
// import BottomNavigationLayout from 'src/layouts/BottomNavigationLayout';
// import TopNavigationLayout from 'src/layouts/TopNavigationLayout';

// import dashboardsRoutes from './dashboards';
// import blocksRoutes from './blocks';
import applicationsRoutes from './applications';
import managementRoutes from './management';
// import documentationRoutes from './documentation';
import accountRoutes from './account';
import baseRoutes from './base';

// const Loader = (Component) => (props) =>
//   (
//     <Suspense fallback={<SuspenseLoader />}>
//       <Component {...props} />
//     </Suspense>
//   );
//   const Room = Loader(
//     lazy(() => import('src/components/Room/Room'))
//   );

const router = [
  {
    path: 'account',
    children: accountRoutes
  },
  {
    path: '*',
    element: <BaseLayout />,
    children: baseRoutes
  },
  {
    path: 'rooms',
    element: (<Authenticated>
      <CollapsedSidebarLayout />
    </Authenticated>),
    children:[
      {
        path:'/:eventid',
        element:<Room/>
      }
    ]
  },
  {
    path: 'extended-sidebar',
    element: (
      <Authenticated>
      <Activated>
        <ExtendedSidebarLayout />
        </Activated >
      </Authenticated>
    ),
    children: [
      {
        path: '/',
        element: <Navigate to="management" replace />
      },
      {
        path: 'applications',
        children: applicationsRoutes
      },
      {
        path: 'management',
        children: managementRoutes
      },

    ],

  },
  {
    path:'auth/activate/:token/',
    element:(
      <ChangePass />
    )
  },
  {
    path: 'auth/resetpassword/:token',
    element:(
      <ChangePassword/>
    )
  }
];
export default router;
