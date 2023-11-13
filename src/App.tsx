import CustomQueryClientProvider from './CustomQueryClientProvider';
import { Outlet, useLocation } from 'react-router-dom';
import { AngularBasePageReact } from './angularBasePage.component';
import { AngularRouterReact } from './angularRouter.component';
import initializei18n from './initializeI18n';


initializei18n().then(() => () => {
  // noop, successfully initialized translations
});

function App() {
  const location = useLocation()
  console.log(location.pathname);

  return (
    <>
      <CustomQueryClientProvider>
        <AngularBasePageReact />
        {/*Outlet is where router children will be rendered*/}
        <Outlet/>

      </CustomQueryClientProvider>
    </>
  );
}

export default App;
