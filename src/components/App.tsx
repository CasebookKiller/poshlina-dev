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

import { useEffect, type FC} from 'react';

import {
  HashRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { routes } from '@/navigation/routes';

function BackButtonManipulator() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    function onClick() {
      navigate(-1);
    }
    backButton.onClick(onClick);

    return () => backButton.offClick(onClick);
  }, [navigate]);

  useEffect(() => {
    console.log('location.pathname: ', location.pathname);
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
  init();
  const lp = useLaunchParams();
  
  miniApp.mount();
  //miniApp.bindCssVars();

  themeParams.mount();
  if (!themeParams.isCssVarsBound()) themeParams.bindCssVars();
  console.log('ThemeParams', themeParams);

  if (!viewport.isMounted) viewport.mount();
  
  backButton.mount();
  console.log('miniApp', miniApp);
  
  //console.log('popup: ', popup.isSupported());

  return (
    <AppRoot
      appearance={miniApp.isDark() ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(lp.platform) ? 'ios' : 'base'}

    >
      <Router>
        {/*<MainButtonManipulator/>*/}
        <BackButtonManipulator/>
        <Routes>
          {routes.map((route) => <Route key={route.path} {...route} />)}
          <Route path='*' element={<Navigate to='/'/>}/>
        </Routes>
      </Router>
    </AppRoot>
  );
}

export default App
