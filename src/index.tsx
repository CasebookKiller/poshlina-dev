// Раскомментируйте этот импорт на случай, если вы захотите разрабатывать приложение за пределами
// приложения Telegram в вашем браузере.
import './mockEnv.ts';

import '@telegram-apps/telegram-ui/dist/styles.css';
import './index.css';

import { createRoot } from 'react-dom/client';
import { Root } from '@/components/Root';

createRoot(document.getElementById('root')!).render(<Root/>);