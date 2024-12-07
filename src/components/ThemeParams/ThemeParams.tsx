import { Cell } from "@telegram-apps/telegram-ui";
import { FC } from "react";
import { Link } from "react-router-dom";

export const ThemeParams: FC = () => {
  return (
    <Link to='/theme-params'>
      <Cell subtitle='Информация о палитре приложений Telegram'>Параметры темы</Cell>
    </Link>
  );
}