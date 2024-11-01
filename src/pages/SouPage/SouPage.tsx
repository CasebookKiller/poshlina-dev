import { FC, useState } from "react";

import { Calc } from "@/components/Calc/Calc";

import './SouPage.css'
import {
  App,
  ConfigProvider,
} from "antd";
import { themeParams } from "@telegram-apps/sdk-react";

import { tokenThemeConfig } from "@/components/configprovider/theme";
import { tokenButtonConfig } from "@/components/configprovider/button";
import { tokenInputConfig } from "@/components/configprovider/input";
import { tokenSelectConfig } from "@/components/configprovider/select";
import { tokenDividerConfig } from "@/components/configprovider/divider";
import { tokenListConfig } from "@/components/configprovider/list";
import { tokenTypographyConfig } from "@/components/configprovider/typography";
import { tokenSwitchConfig } from "@/components/configprovider/switch";
import { tokenInputNumberConfig } from "@/components/configprovider/inputnumber";


export const SouPage: FC = () => {
  const [sum, setSum] = useState('');
  const [posh, setPosh] = useState('');
  
  themeParams.mount();

  return (
    <>
    <div className="contentWrapper">
    <ConfigProvider
      theme={{
        token: tokenThemeConfig,
        components: {
          Button: tokenButtonConfig,
          Input: tokenInputConfig,
          Select: tokenSelectConfig,
          Divider: tokenDividerConfig,
          List: tokenListConfig,
          Typography: tokenTypographyConfig,
          Switch: tokenSwitchConfig,
          InputNumber: tokenInputNumberConfig,
        }
      }}
    >
      <App>
        <Calc 
          header='Размер государственной пошлины при обращении в суды общей юрисдикции'
          footer='Расчёт размера государственной пошлины производится в соответствии со статьей 333.19 НК РФ.'
          sum={sum}
          posh={posh}
          setSum={setSum}
          setPosh={setPosh}
          courtType="obsh"
        />
      </App>      
    </ConfigProvider>
    </div>
    </>
  );
};
