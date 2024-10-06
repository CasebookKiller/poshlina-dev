import { Section, Cell, Image, List, Input, Caption, Placeholder } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';

import { Link } from '@/components/Link/Link.tsx';

import tonSvg from './ton.svg';

export const IndexPage: FC = () => {
  return (
    <List>
      <Section header='Калькулятор государственной пошлины'>
        <Placeholder>
          <Caption level='1'>
            Приложение для расчета государственной пошлины, уплачиваемой при обращении в суды общей юрисдикции, к мировым судьям и в арбитражные суды.
          </Caption>
        </Placeholder>
        <List>
          <Link to='/sou'>
            <Cell>Суды общей юрисдикции</Cell>
          </Link>
        </List>
      </Section>
      <Section
        header='Размер государственной пошлины'
        footer='Расчёт размера государственной пошлины производится в соответствии со статьями 333.19 и 333.21 НК РФ.'
      >
          <Input
            id='sum'
            header="Цена иска" 
            placeholder="Введите цену иска"
            style={{ width: '100%' }}
          />
          <Input 
            id='posh'
            header="Размер пошлины"
            status='default'
            readOnly
            value={'0'}
          />
      </Section>
      <Section
        header='Особенности'
        footer='Вы можете воспользоваться этими страницами, чтобы узнать больше о функциях, предоставляемых мини-приложениями Telegram и другими полезными проектами'
      >
        <Link to='/ton-connect'>
          <Cell
            before={<Image src={tonSvg} style={{ backgroundColor: '#5288C1' }}/>}
            subtitle='Подключите свой кошелек TON'
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
