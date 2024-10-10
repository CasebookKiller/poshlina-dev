import { 
  //Section, Input 
} from "@telegram-apps/telegram-ui";

import { FC, useState } from "react";

import { Calc } from "@/components/Calc/Calc";

export const SouPage: FC = () => {
  const [sum, setSum] = useState('');
  const [posh, setPosh] = useState('');
  return (
    <>
    <Calc 
      header='Размер государственной пошлины при обращении в суды общей юрисдикции'
      footer='Расчёт размера государственной пошлины производится в соответствии со статьями 333.19 и 333.21 НК РФ.'
      sum={sum}
      posh={posh}
      setSum={setSum}
      setPosh={setPosh}
    />
    {/*
    <Section
      header='Размер государственной пошлины при обращении в суды общей юрисдикции'
      footer='Расчёт размера государственной пошлины производится в соответствии со статьями 333.19 и 333.21 НК РФ.'
    >
      <Input
        id='sum'
        header="Цена иска" 
        placeholder="Введите цену иска"
        style={{ width: '100%' }}
      />
      <Input 
        id='posh'
        header="Размер пошлины"
        status='default'
        readOnly
        value={'0'}
      />
    </Section>
     */}
    </>
  );
};
