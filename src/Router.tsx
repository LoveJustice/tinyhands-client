import { createBrowserRouter } from 'react-router-dom';
import PageWithLotsOfReactComponents from './pageWithLotsOfReactComponents';
import App from './App';
import ErrorPage from './ErrorPage';

const Router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/react-things',
        element: <PageWithLotsOfReactComponents />,
      },
    ]
}])

export default Router;