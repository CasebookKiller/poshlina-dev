import { FC, useEffect } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary.tsx';
import { PrimeReactProvider } from 'primereact/api';
import { Button } from 'primereact/button';

import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
        
import '../../themes/lara-light-cyan/theme.css';

import './WWW.css';

interface InnerProps {
  Component: FC;
  pageProps: any;
}

const Inner: FC<InnerProps> = ({Component, pageProps}) => {

  useEffect(() => {
  }, []);

  return (
    <PrimeReactProvider>
      <Component {...pageProps} />
    </PrimeReactProvider>
  );
};

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

interface AppProps {
  title?: string;
}

interface primeTheme {
  name?: string;
  dark: boolean;
  color?: string;
  full: string;
}

const themes: primeTheme[] = [
  { name: 'bootstrap4', dark: false, color: 'blue', full: 'bootstrap4-light-blue' },
  { name: 'bootstrap4', dark: false, color: 'purple', full: 'bootstrap4-light-purple' },
  { name: 'bootstrap4', dark: true, color: 'blue', full: 'bootstrap4-dark-blue' },
  { name: 'bootstrap4', dark: true, color: 'purple', full: 'bootstrap4-dark-purple' },
  { name: 'md', dark: false, color: 'indigo', full: 'md-light-indigo' },
  { name: 'md', dark: false, color: 'deeppurple', full: 'md-light-deeppurple' },
  { name: 'md', dark: true, color: 'indigo', full: 'md-dark-indigo' },
  { name: 'md', dark: true, color: 'deeppurple', full: 'md-dark-deeppurple' },
  { name: 'mdc', dark: false, color: 'indigo', full: 'mdc-light-indigo' },
  { name: 'mdc', dark: false, color: 'deeppurple', full: 'mdc-light-deeppurple' },
  { name: 'mdc', dark: true, color: 'indigo', full: 'mdc-dark-indigo' },
  { name: 'mdc', dark: true, color: 'deeppurple', full: 'mdc-dark-deeppurple' },
  { name: 'tailwind', dark: false, full: 'tailwind-light' },
  { name: 'fluent', dark: false, full: 'fluent-light' },
  { name: 'lara', dark: false, color: 'blue', full: 'lara-light-blue' },
  { name: 'lara', dark: false, color: 'indigo', full: 'lara-light-indigo' },
  { name: 'lara', dark: false, color: 'purple', full: 'lara-light-purple' },
  { name: 'lara', dark: false, color: 'teal', full: 'lara-light-teal' },
  { name: 'lara', dark: true, color: 'blue', full: 'lara-dark-blue' },
  { name: 'lara', dark: true, color: 'indigo', full: 'lara-dark-indigo' },
  { name: 'lara', dark: true, color: 'purple', full: 'lara-dark-purple' },
  { name: 'lara', dark: true, color: 'teal', full: 'lara-dark-teal' },
  { name: 'soho', dark: false, full: 'soho-light' },
  { name: 'soho', dark: true, full: 'soho-dark' },
  { name: 'viva', dark: false, full: 'viva-light' },
  { name: 'viva', dark: true, full: 'viva-dark' },
  { name: 'mira', dark: false, full: 'mira' },
  { name: 'nano', dark: false, full: 'nano' },
  { name: 'saga', dark: false, color: 'blue', full: 'saga-blue' },
  { name: 'saga', dark: false, color: 'green', full: 'saga-green' },
  { name: 'saga', dark: false, color: 'orange', full: 'saga-orange' },
  { name: 'saga', dark: false, color: 'purple', full: 'saga-purple' },
  { name: 'vela', dark: false, color: 'blue', full: 'vela-blue' },
  { name: 'vela', dark: false, color: 'green', full: 'vela-green' },
  { name: 'vela', dark: false, color: 'orange', full: 'vela-orange' },
  { name: 'vela', dark: false, color: 'purple', full: 'vela-purple' },
  { name: 'arya', dark: true, color: 'blue', full: 'arya-blue' },
  { name: 'arya', dark: true, color: 'green', full: 'arya-green' },
  { name: 'arya', dark: true, color: 'orange', full: 'arya-orange' },
  { name: 'arya', dark: true, color: 'purple', full: 'arya-purple' }
];

const defaultTheme = 5;

const theme = `../../themes/${themes[defaultTheme].full}/theme.css`

console.log(theme);

//import(theme).then((module) => module?.use && module.use());
  
const App: FC<AppProps> = ({title}) => {

  return (
    <div className={'without-telegram'}>
      <div className="surface-0 text-700 text-center">
        <div className="text-600 text-primary font-bold mb-3">Мини-приложение создано для работы в Telegram</div>
        <div className="text-900 font-bold text-4xl m-3">{title}</div>
        <div className="text-700 text-xl m-5">Приложение позволяет производить расчеты государственной пошлины при обращении в суды общей юрисдикции и арбитражные суды.</div>
        <Button
          label="Открыть"
          icon="pi pi-telegram"
          className="font-bold px-5 py-2 p-button-raised white-space-nowrap"
          onClick={() => window.open('https://t.me/tgfee_bot')}
        />
      </div>
    </div>
  );
}

export const WithoutTelegram: FC = () => (
  <ErrorBoundary fallback={ErrorBoundaryError}>
    <Inner
      Component={App}
      pageProps={{title: 'Калькулятор государственной пошлины'}}
    />
  </ErrorBoundary>
);