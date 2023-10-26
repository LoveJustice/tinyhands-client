import { createBrowserRouter } from 'react-router-dom';
import PageWithLotsOfReactComponents from './pageWithLotsOfReactComponents';
import App from './App';
import ErrorPage from './ErrorPage';
import { SimpleComponentReact } from './SimpleComponent'

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
      {
        path: '/simple-wrapped-angular-component',
        element: <SimpleComponentReact />
      }
    ]
}])

export default Router;