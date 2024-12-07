import { Section } from "@telegram-apps/telegram-ui";
import { TonConnect } from "@/components";
import { FC } from "react";

export const AppFeatures: FC = () => {
  return (
    <Section
      header='Особенности'
      footer='Вы можете воспользоваться этими страницами, чтобы узнать больше о функциях, предоставляемых мини-приложениями Telegram и другими полезными проектами'
    >
      <TonConnect />
    </Section>
  );
}
