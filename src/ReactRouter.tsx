import { createBrowserRouter, RouteObject } from 'react-router-dom';
import PageWithLotsOfReactComponents from './examples/pageWithLotsOfReactComponents';
import App from './App';
import { SimpleComponentReact } from './examples/SimpleComponent';
import { AngularRouterReact } from './angularRouter.component';

// function FallbackToAngular(){
//   const location = useLocation();
//   return <Navigate to="/" replace={true} state={{ from: location }} />
// }

// Abusing the id parameter name,
// That is what we are going to pass to angular as it's id
const TOP_LEVEL_REACT_PAGES: RouteObject[] = [
  {
    id: 'reactThings',
    path: '/react/react-things',
    element: <PageWithLotsOfReactComponents />,
  },
  {
    id: 'simpleWrappedAngularComponent',
    path: '/react/simple-wrapped-angular-component',
    element: <SimpleComponentReact />,
  },
  {
    index: true,
    element: <div>
      <AngularRouterReact />
    </div>,
  },
];

const ReactRouter = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    // errorElement: <FallbackToAngular />,
    children: TOP_LEVEL_REACT_PAGES,
  }]);

export default ReactRouter;

export { TOP_LEVEL_REACT_PAGES };