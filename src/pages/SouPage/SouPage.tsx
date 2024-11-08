import { FC, useState } from "react";

import { Calc } from "@/components/Calc/Calc";

import './SouPage.css'
import {
  App,
} from "antd";
import { themeParams } from "@telegram-apps/sdk-react";

export const SouPage: FC = () => {
  const [sum, setSum] = useState('');
  const [posh, setPosh] = useState('');
  
  themeParams.mount();

  return (
    <>
    <div className="contentWrapper">
      <App>
        <Calc 
          header={<>Размер государственной пошлины<br/>при обращении в суды общей юрисдикции</>}
          footer={<>Расчёт размера государственной пошлины производится в соответствии со статьей 333.19 НК РФ.</>}
          sum={sum}
          posh={posh}
          setSum={setSum}
          setPosh={setPosh}
          courtType="obsh"
        />
      </App>      
    </div>
    </>
  );
};
