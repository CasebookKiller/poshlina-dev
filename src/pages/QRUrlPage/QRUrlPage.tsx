import { FC, useState } from "react";

import { Calc } from "@/components/Calc/Calc";

import './QRUrlPage.css'
import { App } from "antd";
//import { themeParams } from "@telegram-apps/sdk-react";
import { calcPosh, Code, getCode } from "@/components/Calc/functions";

const txtColor = import.meta.env.VITE_TXT_COLOR;
const txtColorRed = import.meta.env.VITE_TXT_COLOR_RED;

export interface QRUrlPageProps {
  QRUrl?: string;
}

export const QRUrlPage: FC<QRUrlPageProps> = (props) => {
  console.log('%cQRUrl: %o', `color: ${txtColorRed}`, props.QRUrl);

  let code: Code|undefined = {
    benefitsSwitch: false,
    discount30Switch: false,
    discount50Switch: false,
    sou: '',
    arb: ''
  };

  const storedQRUrl = sessionStorage.getItem('QRUrl');
  sessionStorage.setItem('QRUrl', '');
  
  const param = storedQRUrl?.split('startapp=')[1];

  code = getCode( param || '' );
  console.log('%ccode: %o', `color: ${txtColorRed}`, code);
  
  const qrsum = code?.sou !=='' ? code?.sou.replace(/ /g,'') : code?.arb !=='' ? code?.arb.replace(/ /g,'') || '': '';

  const courtType = code?.arb !=='' ? 'arb' : 'obsh' ;

  const qrposh = calcPosh( qrsum || '', courtType, code?.benefitsSwitch, code?.discount30Switch, code?.discount50Switch);
  
  console.log('%cqrsum: %o', `color: ${txtColor}`, qrsum);
  console.log('%cqrposh: %o', `color: ${txtColor}`, qrposh);

  const [sum, setSum] = useState(qrsum);
  const [posh, setPosh] = useState(qrposh || '');
  
  //themeParams.mount();

  return (
    <>
      <div className="contentWrapper">
        <App>
          <Calc 
            header={
              courtType === 'obsh' ?
                <>Размер государственной пошлины<br/>при обращении в суды общей юрисдикции</>:
                <>Размер государственной пошлины<br/>при обращении в арбитражные суды</>
            }
            footer={
              courtType === 'obsh' ?
              <>Расчёт размера государственной пошлины производится в соответствии со статьей 333.19 НК РФ.</>:
              <>Расчёт размера государственной пошлины производится в соответствии со статьей 333.21 НК РФ.</>
            }
            sum={sum}
            posh={String(posh)}
            setSum={(newSum) => setSum(newSum as any)} // Cast newSum to any
            setPosh={(newPosh) => setPosh(newPosh as any)} // Cast newPosh to any
            courtType={courtType}
            code={code}
          />
        </App>      
      </div>
    </>
  );
};
