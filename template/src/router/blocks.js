import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';

import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

// Blocks

const ComposedCards = Loader(
  lazy(() => import('src/content/blocks/ComposedCards'))
);
const ProgressHorizontal = Loader(
  lazy(() => import('src/content/blocks/ProgressHorizontal'))
);

const blocksRoutes = [
  {
    path: '/',
    element: <Navigate to="charts-large" replace />
  },
  {
    path: 'progress-horizontal',
    element: <ProgressHorizontal />
  },
];

export default blocksRoutes;
