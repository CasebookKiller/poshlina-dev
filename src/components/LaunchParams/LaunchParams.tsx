import { Cell } from "@telegram-apps/telegram-ui";
import { FC } from "react";
import { Link } from "react-router-dom";

export const LaunchParams: FC = () => {
  return (
    <Link to='/launch-params'>
      <Cell subtitle='Идентификатор платформы, версия мини-приложения и т.д.'>Параметры запуска</Cell>
    </Link>
  );
}