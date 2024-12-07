import { Section } from "@telegram-apps/telegram-ui";
import { FC } from "react";
import { InitData } from "../InitData/InitData";
import { LaunchParams } from "../LaunchParams/LaunchParams";
import { ThemeParams } from "../ThemeParams/ThemeParams";

export const StartAppInfo: FC = () => {
  return (
    <Section
      header='Данные о запуске приложения'
      footer='Эти страницы помогают разработчикам узнать больше о текущей информации о запуске'
    >
      <InitData />
      <LaunchParams />
      <ThemeParams />
    </Section>
  );
}