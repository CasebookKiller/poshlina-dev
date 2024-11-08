import { useLaunchParams } from '@telegram-apps/sdk-react';
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


const Inner: FC = () => {
  console.log('Запуск приложения');
  console.log(`Для запуска приложения в режиме отладки запустите бот с параметром: ?startapp=debug\n
    https://t.me/{botusername}/{appname}?startapp=debug`);
  const LP = useLaunchParams();
  console.log('Параметры запуска:', LP);
  const SP = LP.startParam;
  const debug = SP === 'debug';
  console.log('Режим отладки:', debug);
  const manifestUrl = useMemo(() => {
    return new URL('tonconnect-manifest.json', window.location.href).toString();
  }, []);

  // Включите режим отладки, чтобы просмотреть все отправленные методы и полученные события.
  useEffect(() => {
    if (debug) {
      console.log('Режим отладки включен');
      import('eruda').then((lib) => lib.default.init());
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
