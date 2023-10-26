import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.scss';
import CustomQueryClientProvider from './CustomQueryClientProvider';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <>
      <div>
        <a href='https://vitejs.dev' target='_blank'>
          <img src={viteLogo} className='logo' alt='Vite logo' />
        </a>
        <a href='https://react.dev' target='_blank'>
          <img src={reactLogo} className='logo react' alt='React logo' />
        </a>
      </div>
      <h1>Vite + React</h1>
      <CustomQueryClientProvider>
          {/* TODO navbar here */}
          {/*Outlet is where router children will be rendered*/}
          <Outlet />
      </CustomQueryClientProvider>
    </>
  );
}

export default App;
