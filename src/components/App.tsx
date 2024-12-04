import {
//  shareURL,
//  popup,
//  mainButton,
  backButton,
  useLaunchParams,
  miniApp,
  themeParams,
  viewport,
  init,
} from '@telegram-apps/sdk-react';

import { AppRoot } from '@telegram-apps/telegram-ui';

import { useEffect, useState, type FC} from 'react';

import {
  HashRouter as Router,
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
import { StartUrlPage } from '@/pages/StartUrlPage/StartUrlPage';

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

/*
function MainButtonManipulator() {
  const location = useLocation();

  let mainButtonParams = {
    backgroundColor: themeParams.buttonColor() || '#2990ff',
    textColor: themeParams.buttonTextColor() || '#ffffff',
    text: 'Поделиться расчетом'
  }
  
  if (!mainButton.isMounted()) mainButton.mount();
  
  mainButton.setParams(mainButtonParams);
  
  if (location.pathname === '/sou' || location.pathname === '/arb') mainButton.mount();
  console.log('Добавлена главная кнопка', mainButton);

  useEffect(() => {
    console.log('location.pathname: ', location.pathname);
    if (location.pathname === '/sou' || location.pathname === '/arb') {
      mainButton.setParams({ text: 'Поделиться расчетом', isVisible: true, isEnabled: true });
      mainButton.mount();
    } else {
      mainButton.setParams({ text: 'Перейдите на страницу с расчетом', isVisible: false, isEnabled: true });
      mainButton.mount();
    }
    mainButton.onClick(() => {
      try {
        console.log('mainButton.onCLick');
        popup.open({
            title: 'Поделиться расчетом!',
            message: 'Для того чтобы поделиться расчетом, нажмите на кнопку Ok.',
            buttons: [
              { id: 'btnproceed', type: 'default', text: 'Ok' },
              { id: 'btncancel', type: 'cancel' },
            ],
          })
          .then((buttonId: string|null) => {
            if (buttonId === 'btnproceed') {
              const url = 'https://t.me/GosPoshlinaDevBot/poshlina';
              shareURL(`Посмотрите мое приложение ${url}`);
            } else {
              console.log(
                buttonId === null 
                  ? 'Пользователь не нажимал кнопок.'
                  : `Пользователь нажал кнопку с ID "${buttonId}"`
              );
            }
           
          });
  
        console.log(popup.isOpened); // true
        
        console.log('Окно выбора чата открыто для отправки сообщения.');
      } catch (error) {
        console.error('Ошибка при открытии окна выбора чата:', error);
      }
    })
  }, [location]);

  return null;
  
}
*/

export const App: FC = () => {
  const [code, setCode] = useState<Code>({} as Code);

  init(); console.log('%cinit: %o', `color: ${txtColor}`, miniApp);
  const LP = useLaunchParams();
  const SP = LP.initData?.startParam;

  // добавляем straniцы
  const sou: AppRoute = { path: '/sou', element: <SouPage startParam= {''}/>, title: 'Суды общей юрисдикции' };
  const arb: AppRoute = { path: '/arb', element: <ArbPage startParam= {''}/>, title: 'Арбитражные суды' };
  const starturl: AppRoute = { path: '/starturl', element: <StartUrlPage startParam= {SP}/>, title: 'Расчёт по ссылке' };
  routes.push(sou, arb, starturl);

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

  return (
    <AppRoot
      appearance={miniApp.isDark() ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(LP.platform) ? 'ios' : 'base'}

    >
      <Router>
        {/*<MainButtonManipulator/>*/}
        <BackButtonManipulator/>
        <Routes>
          {routes.map((route) => {
            console.log('Route: ', route);
            return (<Route key={route.path} {...route} />);
          })}
          <Route path='*' element={<Navigate to={'/'}/>}/>
        </Routes>
      </Router>
    </AppRoot>
  );
}

export default App