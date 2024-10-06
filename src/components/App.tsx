import { useIntegration } from '@telegram-apps/react-router-integration';
import { secondaryButton } from '@telegram-apps/sdk';
import {
  bindMiniAppCSSVars,
  bindThemeParamsCSSVars,
  bindViewportCSSVars,
  initMainButton,
  initNavigator, initUtils, useLaunchParams,
  initPopup, 
  useMiniApp,
  useThemeParams,
  useViewport,
} from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { type FC, useEffect, useMemo } from 'react';
import {
  Navigate,
  Route,
  Router,
  Routes,
} from 'react-router-dom';

import { routes } from '@/navigation/routes.tsx';

export const App: FC = () => {
  const lp = useLaunchParams();
  const miniApp = useMiniApp();
  const themeParams = useThemeParams();
  const viewport = useViewport();

  useEffect(() => {
    return bindMiniAppCSSVars(miniApp, themeParams);
  }, [miniApp, themeParams]);

  useEffect(() => {
    return bindThemeParamsCSSVars(themeParams);
  }, [themeParams]);

  useEffect(() => {
    return viewport && bindViewportCSSVars(viewport);
  }, [viewport]);

  // Создайте новый навигатор приложений и прикрепите его к истории браузера, чтобы он мог изменять
  // его и отслеживать изменения.
  const navigator = useMemo(() => initNavigator('app-navigation-state'), []);
  const [location, reactNavigator] = useIntegration(navigator);

  const [mainButton] = initMainButton();
  console.log('Добавлена главная кнопка', mainButton);
  console.log('ThemeParams', themeParams);
  mainButton.setParams({
    bgColor: themeParams.buttonColor || '#2990ff',
    textColor: themeParams.buttonTextColor || '#ffffff',
    text: 'Поделиться расчетом',
    isVisible: true,
    isEnabled: true,
  });
  mainButton.show();

  secondaryButton.setParams({
    backgroundColor: themeParams.secondaryBgColor || '#2b2b2b',
    textColor: themeParams.textColor || '#ffffff',
    text: 'Закрыть',
    isEnabled: true,
    isVisible: true,
    position: 'bottom',
  });
  secondaryButton.mount();

  secondaryButton.onClick(() => {
    const popup = initPopup();
      
    popup.open({
        title: 'Закрыть?',
        message: 'Для выхода из приложения, нажмите на кнопку Закрыть.',
        buttons: [
          { id: 'btnproceed', type: 'default', text: 'Закрыть' },
          { id: 'btncancel', type: 'cancel' },
        ],
      })
      .then(buttonId => {
        if (buttonId === 'btnproceed') {
          miniApp.close();
        } else {
          console.log(
            buttonId === null 
              ? 'Пользователь не нажимал кнопок.'
              : `Пользователь нажал кнопку с ID "${buttonId}"`
          );
        }
       
      });

    console.log(popup.isOpened); // true

    
  });

  const utils = initUtils();

  // Установка обработчика нажатия на главную кнопку
  mainButton.on('click', () => {
    try {

      const popup = initPopup();
      
      popup.open({
          title: 'Поделиться расчетом!',
          message: 'Для того чтобы поделиться расчетом, нажмите на кнопку Ok.',
          buttons: [
            { id: 'btnproceed', type: 'default', text: 'Ok' },
            { id: 'btncancel', type: 'cancel' },
          ],
        })
        .then(buttonId => {
          if (buttonId === 'btnproceed') {
            const url = 'https://t.me/GosPoshlinaDevBot/poshlina';
            utils.shareURL(`Посмотрите мое приложение ${url}`);
          } else {
            console.log(
              buttonId === null 
                ? 'Пользователь не нажимал кнопок.'
                : `Пользователь нажал кнопку с ID "${buttonId}"`
            );
          }
         
        });

      console.log(popup.isOpened); // true
      
      // Получение текущих очков из localStorage
      // const score = localStorage.getItem('memory-game-score') || 0;
      
      console.log('Окно выбора чата открыто для отправки сообщения.');
    } catch (error) {
      console.error('Ошибка при открытии окна выбора чата:', error);
    }
  });

  // Не забудьте подключить навигатор, чтобы он также мог управлять состоянием кнопки "Назад"
  // в качестве истории браузера.
  useEffect(() => {
    navigator.attach();
    return () => navigator.detach();
  }, [navigator]);

  return (
    <AppRoot
      appearance={miniApp.isDark ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(lp.platform) ? 'ios' : 'base'}
    >
      <Router location={location} navigator={reactNavigator}>
        <Routes>
          {routes.map((route) => <Route key={route.path} {...route} />)}
          <Route path='*' element={<Navigate to='/'/>}/>
        </Routes>
      </Router>
    </AppRoot>
  );
};
