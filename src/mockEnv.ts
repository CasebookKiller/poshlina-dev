import { mockTelegramEnv, parseInitData, retrieveLaunchParams } from '@telegram-apps/sdk-react';

const txtColor = import.meta.env.VITE_TXT_COLOR;

// Важно, чтобы имитация среды выполнялась только в целях разработки. При сборке
// приложения значение import.meta.env.DEV станет ложным, а код внутри будет изменен на древовидный,
// поэтому вы не увидите его в своем окончательном пакете.
if (import.meta.env.DEV) {
  let shouldMock: boolean;

  // Попытка извлечь параметры запуска, чтобы проверить, основана ли текущая среда на Telegram.
  try {
    // Если мы можем извлечь параметры запуска, это означает, что мы уже находимся в среде 
    // Telegram. Таким образом, нет необходимости имитировать её.
    const LP = retrieveLaunchParams();
    console.log('%cПараметры запуска извлечены: %o', `color: ${txtColor}`, parseInitData(LP));
    // Ранее мы могли имитировать окружающую среду. В случае, если мы это сделали, мы должны сделать это снова.
    // Потому что страница может быть перезагружена, и мы должны снова использовать имитацию, потому что имитация также
    // позволяет изменять объект window.
    shouldMock = !!sessionStorage.getItem('____mocked');
  } catch (e) {
    shouldMock = true;
  }

  if (shouldMock) {
    const initDataRaw = new URLSearchParams([
      ['user', JSON.stringify({
        id: 99281932,
        first_name: 'Ivan',
        last_name: 'Petrov',
        username: 'petrov',
        language_code: 'ru',
        is_premium: true,
        allows_write_to_pm: true,
      })],
      ['hash', '89d6079ad6762351f38c6dbbc41bb53048019256a9443988af7a48bcad16ba31'],
      ['auth_date', '1716922846'],
      //['start_param', 'debug', /*'clcg68979879nhbro99281932'*//*'bro99281932clcg214214nh'*//*a1bjh'*//*'debug'*/],
      ['start_param', 'debugclcg68979879nhbro99281932'],
      ['chat_type', 'sender'],
      ['chat_instance', '8428209589180549439'],
    ]).toString();

    mockTelegramEnv({
      themeParams: {
        accentTextColor: '#6ab2f2',
        bgColor: '#17212b',
        buttonColor: '#5288c1',
        buttonTextColor: '#ffffff',
        destructiveTextColor: '#ec3942',
        headerBgColor: '#17212b',
        hintColor: '#708499',
        linkColor: '#6ab3f3',
        secondaryBgColor: '#232e3c',
        sectionBgColor: '#17212b',
        sectionHeaderTextColor: '#6ab3f3',
        subtitleTextColor: '#708499',
        textColor: '#f5f5f5',
      },
      initData: parseInitData(initDataRaw),
      initDataRaw,
      version: '8.0',
      platform: 'tdesktop',
    });
    sessionStorage.setItem('____mocked', '1');

    console.info(
      '%cДо тех пор, пока текущая среда не определяется как основанная на Telegram, она будет имитирована. Обратите внимание, что вы не должны делать этого в рабочей среде, а текущее поведение относится только к процессу разработки. Имитирование среды применяется только в режиме разработки. Таким образом, после создания приложения вы не увидите такого поведения и связанного с ним предупреждения, приводящего к сбою приложения вне Telegram.',
      `color: ${txtColor}`
    );
  }
}