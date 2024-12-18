import {
  backButton,
  useLaunchParams,
  miniApp,
  themeParams,
  viewport,
  init,
} from '@telegram-apps/sdk-react';

import { AppRoot } from '@telegram-apps/telegram-ui';

import { startTransition, useEffect, useState, type FC} from 'react';

import {
  HashRouter,
  Route,
  Routes,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { Route as AppRoute, routes } from '@/navigation/routes';

import { Code, getOrderedParams, link2code, Param, prepareHash } from './Calc/functions';
import { SouPage } from '@/pages/SouPage/SouPage';
import { ArbPage } from '@/pages/ArbPage/ArbPage';
import { NK333_19Page } from '@/pages/NK333_19Page/NK333_19Page';
import { StartUrlPage } from '@/pages/StartUrlPage/StartUrlPage';
import { QRUrlPage } from '@/pages/QRUrlPage/QRUrlPage';
import { NK333_21Page } from '@/pages/NK333_21Page/NK333_21Page';
import { NK333_36Page } from '@/pages/NK333_36Page/NK333_36Page';
import { NK333_37Page } from '@/pages/NK333_37Page/NK333_37Page';
//import { backgroundColor } from './ConfigProvider/variables';

const txtColor = import.meta.env.VITE_TXT_COLOR;

function BackButtonManipulator() {
  const location = useLocation();
  const navigate = useNavigate();

  console.log(window.history);
  console.log(navigate);

  useEffect(() => {
    function onClick() {
      console.log('%chistory: %o', `color: ${txtColor}`, window.history.state);
      console.log(window.history.length);
      if (window.history.state.idx === 1) {
        navigate('/');
        sessionStorage.setItem('QRUrl', '');
      } else {
        navigate(-1);
      }
    }
    backButton.onClick(onClick);

    return () => backButton.offClick(onClick);
  }, [navigate]);

  useEffect(() => {
    console.log('%chistory: %o', `color: ${txtColor}`, window.history.state);
    console.log(window.history.length);
    console.log('%clocation.pathname: %o', `color: ${txtColor}`, location.pathname);
    if (location.pathname === '/' || location.pathname === '/poshlina-dev/') {
      backButton.isVisible() && backButton.hide();
    } else {
      !backButton.isVisible() && backButton.show();
    }
  }, [location]);

  return null;
}

export const App: FC = () => {
  const [code, setCode] = useState<Code>({} as Code);

  init(); console.log('%cinit: %o', `color: ${txtColor}`, miniApp);
  const LP = useLaunchParams();
  const SP = LP.initData?.startParam;

  // добавляем страницы
  const sou: AppRoute = { path: '/sou', element: <SouPage startParam= {''}/>, title: 'Суды общей юрисдикции' };
  const arb: AppRoute = { path: '/arb', element: <ArbPage startParam= {''}/>, title: 'Арбитражные суды' };
  
  const nk333_19: AppRoute = { path: '/nk333_19', element: <NK333_19Page hash= {''}/>, title: 'Статья 333.19 НК РФ' };
  const nk333_21: AppRoute = { path: '/nk333_21', element: <NK333_21Page hash= {''}/>, title: 'Статья 333.21 НК РФ' };
  const nk333_36: AppRoute = { path: '/nk333_36', element: <NK333_36Page hash= {''}/>, title: 'Статья 333.36 НК РФ' };
  const nk333_37: AppRoute = { path: '/nk333_37', element: <NK333_37Page hash= {''}/>, title: 'Статья 333.37 НК РФ' };
  
  const starturl: AppRoute = { path: '/starturl', element: <StartUrlPage startParam= {SP}/>, title: 'Расчёт по ссылке' };
  const qrurl: AppRoute = { path: '/qrurl', element: <QRUrlPage/>, title: 'Расчёт по ссылке' };
  
  routes.push(sou, arb, nk333_19, nk333_21, nk333_36, nk333_37, starturl, qrurl);

  const debug = SP?.includes('debug');
  console.log('%cРежим отладки: %o', `color: ${txtColor}`, debug);

  let orderedParams: Param[] = [];

  useEffect(() => {
    const arr: string[] = SP?.split(/clc|bro/) ?? [];
    orderedParams = getOrderedParams(SP ?? '', arr) ?? [];

    orderedParams.forEach((item) => {
      if (item.name === 'clc') {
        setCode(link2code(prepareHash(item.value)));
        console.log('%cclc: %o', `color: ${txtColor}`, code);
      }
    })
  }, []);
  
  miniApp.mount();

  themeParams.mount();
  if (!themeParams.isCssVarsBound()) themeParams.bindCssVars();
  console.log('%cThemeParams: %o', `color: ${txtColor}`, themeParams);

  if (!viewport.isMounted) viewport.mount();
  
  backButton.mount();
  console.log('%cminiApp: %o', `color: ${txtColor}`, miniApp);
  
  //console.log('popup: ', popup.isSupported());

  startTransition(() => {
    console.log('%corderedParams: %o', `color: ${txtColor}`, orderedParams);
  })

  return (
    <AppRoot
      appearance={miniApp.isDark() ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(LP.platform) ? 'ios' : 'base'}
      style={{ }}
    >
      <HashRouter>
        {/*<MainButtonManipulator/>*/}
        <BackButtonManipulator/>
        <Routes>
          {routes.map((route) => {
            console.log('Route: ', route);
            return (<Route key={route.path} {...route} />);
          })}
          <Route path='*' element={<Navigate to={'/'}/>}/>
        </Routes>
      </HashRouter>
    </AppRoot>
  );
}

export default App