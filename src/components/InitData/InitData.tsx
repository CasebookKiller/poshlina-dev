import { Cell } from "@telegram-apps/telegram-ui";
import { FC } from "react";
import { Link } from "react-router-dom";

export const InitData: FC = () => {
  return (
    <Link to='/init-data'>
      <Cell subtitle='Пользовательские данные, информация о чате, технические данные'>Данные инициализации</Cell>
    </Link>
  );
}