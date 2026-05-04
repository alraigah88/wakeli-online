import HomePage from '../pages/home/page';
import NotFound from '../pages/NotFound';
import { RouteObject } from 'react-router-dom';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '*',
    element: <NotFound />
  }
];

export default routes;
