import { Section, Cell, List, Image } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';

import { Link } from '@/components/Link/Link.tsx';

import tonSvg from './ton.svg';

export const IndexPage: FC = () => {
  console.log('IndexPage: ', window.location);
  console.log('history:', history);
  return (
    <List>
      <Section
        header='Расчет государственной пошлины'
        footer='Расчёт размера государственной пошлины производится в соответствии Налоговым кодексом РФ (начиная с 09.09.2024).'
      >
        <Link to='/sou'>
          <Cell
            subtitle='Статья 333.19 НК РФ  '
          >
            Суды общей юрисдикции, мировые суды
          </Cell>
        </Link>
        <Link to='/arb'>
          <Cell
            subtitle='Статья 333.21 НК РФ'
          >
            Арбитражные суды
          </Cell>
        </Link>
      </Section>
      <Section
        header='Особенности'
        footer='Вы можете воспользоваться этими страницами, чтобы узнать больше о функциях, предоставляемых мини-приложениями Telegram и другими полезными проектами'
      >
        <Link to='/ton-connect'>
          <Cell
            before={<Image src={tonSvg} style={{ backgroundColor: '#5288C1' }}/>}
            subtitle='Подключите кошелек TON'
          >
            TON Connect
          </Cell>
        </Link>
      </Section>
      <Section
        header='Данные о запуске приложения'
        footer='Эти страницы помогают разработчикам узнать больше о текущей информации о запуске'
      >
        <Link to='/init-data'>
          <Cell subtitle='Пользовательские данные, информация о чате, технические данные'>Данные инициализации</Cell>
        </Link>
        <Link to='/launch-params'>
          <Cell subtitle='Идентификатор платформы, версия мини-приложения и т.д.'>Параметры запуска</Cell>
        </Link>
        <Link to='/theme-params'>
          <Cell subtitle='Информация о палитре приложений Telegram'>Параметры темы</Cell>
        </Link>
      </Section>
    </List>
  );
};
