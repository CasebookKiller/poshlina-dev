import { FC, useState } from "react";

import { Calc } from "@/components/Calc/Calc";

import './ArbPage.css'
import {
  App,
} from "antd";
import { themeParams } from "@telegram-apps/sdk-react";

export const ArbPage: FC = () => {
  const [sum, setSum] = useState('');
  const [posh, setPosh] = useState('');
  
  themeParams.mount();

  return (
    <>
    <div className="contentWrapper">
      <App>
        <Calc 
          header='Размер государственной пошлины при обращении в арбитражные суды'
          footer='Расчёт размера государственной пошлины производится в соответствии со статьей 333.21 НК РФ.'
          sum={sum}
          posh={posh}
          setSum={setSum}
          setPosh={setPosh}
          courtType="arb"
        />
      </App>      
    </div>
    </>
  );
};
