import { //init, miniApp,
  useLaunchParams } from '@telegram-apps/sdk-react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { type FC, useEffect, useMemo } from 'react';

import App from '@/components/App';
import { ErrorBoundary } from '@/components/ErrorBoundary.tsx';
import { ConfigProvider } from 'antd';
import { tokenThemeConfig } from './ConfigProvider/theme';
import { tokenButtonConfig } from './ConfigProvider/button';
import { tokenDividerConfig } from './ConfigProvider/divider';
import { tokenInputConfig } from './ConfigProvider/input';
import { tokenInputNumberConfig } from './ConfigProvider/inputnumber';
import { tokenListConfig } from './ConfigProvider/list';
import { tokenSelectConfig } from './ConfigProvider/select';
import { tokenSwitchConfig } from './ConfigProvider/switch';
import { tokenTypographyConfig } from './ConfigProvider/typography';

const ErrorBoundaryError: FC<{ error: unknown }> = ({ error }) => (
  <div>
    <p>Произошла необработанная ошибка:</p>
    <blockquote>
      <code>
        {error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : JSON.stringify(error)}
      </code>
    </blockquote>
  </div>
);

const txtColor = import.meta.env.VITE_TXT_COLOR;

const Inner: FC = () => {
  //init();
  //const MA = miniApp;
  //if (!MA.isMounted()) MA.mount();
  //MA.setHeaderColor('#fff');
  //MA.setBackgroundColor('#fff');
  const LP = useLaunchParams();
  const SP = LP?.initData?.startParam;
  
  console.log('%cЗапуск приложения', `color: ${txtColor}`);
  console.log(`%cДля запуска приложения в режиме отладки запустите бот с параметром: ?startapp=debug\n
    https://t.me/{botusername}/{appname}?startapp=debug`, `color: ${txtColor}`);
  
  console.log('%cПараметры запуска: %o', `color: ${txtColor}`, LP);
  const debug = SP?.includes('debug') || SP === 'debug';
  console.log('%cРежим отладки: %o', `color: ${txtColor}`, debug);
  const manifestUrl = useMemo(() => {
    return new URL('tonconnect-manifest.json', window.location.href).toString();
  }, []);

  // Включите режим отладки, чтобы просмотреть все отправленные методы и полученные события.
  useEffect(() => {
    if (debug) {
      //console.log('%cРежим отладки включен', 'color: ${txtColor}');
      //import('eruda').then((lib) => lib.default.init());
    }
  }, [debug]);

  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <ConfigProvider
        theme={{
          token: tokenThemeConfig,
          components: {
            Button: tokenButtonConfig,
            Input: tokenInputConfig,
            Select: tokenSelectConfig,
            Divider: tokenDividerConfig,
            List: tokenListConfig,
            Typography: tokenTypographyConfig,
            Switch: tokenSwitchConfig,
            InputNumber: tokenInputNumberConfig,
          }
        }}
      >
        <App/>
      </ConfigProvider>
    </TonConnectUIProvider>
  );
};

export const Root: FC = () => (
  <ErrorBoundary fallback={ErrorBoundaryError}>
    <Inner/>
  </ErrorBoundary>
);
