import { TCLR } from "@/components/init";

import { FC } from "react";
import { ConfigProvider } from "antd-mobile"

import './NK333_21Page.css'

import ruRU from "antd-mobile/es/locales/ru-RU";
interface NK333_21PageProps {
  hash?: string
  editionDate?: string
}
export const NK333_21Page: FC<NK333_21PageProps> = ( props ) => {
  console.log('%chash: %o', `color: ${TCLR}`, props.hash);
  console.log('%cNK333_21Page: %o', `color: ${TCLR}`, props.editionDate);
return (
  <>
    <ConfigProvider locale={ruRU}>
      <h1>Статья 333.21 НК РФ</h1>
      <p>Налоговая органом в соответствии с положениями НК РФ установлено, что с 1 января 2019 года:</p>
    </ConfigProvider>
  </>
);
}