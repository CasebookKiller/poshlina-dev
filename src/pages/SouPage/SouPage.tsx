import { 
//  Section as TGSection, 
//  Input as TGInput,
//  Button as TGButton,
//  Cell as TGCell, 
//  Switch as TGSwitch,
} from "@telegram-apps/telegram-ui";

import { FC, useState } from "react";

import { Calc } from "@/components/Calc/Calc";

import './SouPage.css'
import {
  App,
  ConfigProvider,
//  Form,
//  Switch
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
          footer='Расчёт размера государственной пошлины производится в соответствии со статьями 333.19 и 333.21 НК РФ.'
          sum={sum}
          posh={posh}
          setSum={setSum}
          setPosh={setPosh}
        />

{/* 
        <Form
          labelCol={{ span: 6 }}
          name="Calculator"
          layout="horizontal"
          autoComplete="off"
          initialValues={{
            "courtType": "obsh" 
          }}
        >
          <TGSection
            header='Размер государственной пошлины при обращении в суды общей юрисдикции'
            footer='Расчёт размера государственной пошлины производится в соответствии со статьями 333.19 и 333.21 НК РФ.'
          >
            <TGCell
              Component="label"
              after={<TGSwitch defaultChecked />}
              description="Pass Component='label' to Cell to make it clickable."
              multiline
            >
              First radio
            </TGCell>
          </TGSection>
        </Form>
*/}
      </App>      
    </ConfigProvider>
    </div>
    </>
  );
};
