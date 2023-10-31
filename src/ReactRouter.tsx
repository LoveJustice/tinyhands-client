import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';
import PageWithLotsOfReactComponents from './examples/pageWithLotsOfReactComponents';
import App from './App';
import { SimpleComponentReact } from './examples/SimpleComponent';

// function FallbackToAngular(){
//   const location = useLocation();
//   return <Navigate to="/fallback-success/#!" replace={true} state={{ from: location }} />
// }

// Abusing the id parameter name,
// That is what we are going to pass to angular as it's id
const TOP_LEVEL_REACT_PAGES: RouteObject[] = [
  {
    id: 'reactThings',
    path: 'react-things',
    element: <PageWithLotsOfReactComponents />,
  },
  {
    id: 'simpleWrappedAngularComponent',
    path: 'simple-wrapped-angular-component',
    element: <SimpleComponentReact />,
  }
  ,
  {
    index: true,
    element: <div>Testing</div>
  }
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