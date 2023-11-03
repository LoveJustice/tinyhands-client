import './App.scss';
import CustomQueryClientProvider from './CustomQueryClientProvider';
import { Outlet, useLocation } from 'react-router-dom';
import { AngularBasePageReact } from '../src/angularBasePage.component';
import { AngularRouterReact } from '../src/angularRouter.component';
import initializei18n from './initializeI18n';
import { useTranslation } from 'react-i18next';


initializei18n().then(() => () => {
  // noop, successfully initialized translations
});

function App() {
  const location = useLocation()

  return (
    <>
      <CustomQueryClientProvider>
        <AngularBasePageReact />
        <div>
          {/*Outlet is where router children will be rendered*/}
          <Outlet/>
        </div>
        <div hidden={location.pathname != '/'}>
          <AngularRouterReact />
        </div>
      </CustomQueryClientProvider>
    </>
  );
}

export default App;
