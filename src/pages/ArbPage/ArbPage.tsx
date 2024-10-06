import { Cell, Title } from "@telegram-apps/telegram-ui";

import { FC } from "react";

import { Link } from '@/components/Link/Link.tsx';

export const ArbPage: FC = () => {
  return (
    <Link to='/'>
      <Cell>
        <Title>Главная</Title>
      </Cell>
    </Link>
  );
};
