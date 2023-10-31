import './App.scss';
import CustomQueryClientProvider from './CustomQueryClientProvider';
import { Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { AngularBasePageReact } from './angularBasePage.component';
import { AngularRouterReact } from './angularRouter.component';

function App() {
  const location = useLocation()
  return (
    <>
      <CustomQueryClientProvider>
        <AngularBasePageReact />
        <div hidden={location.pathname == '/'}>
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
