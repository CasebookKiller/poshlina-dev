import { FC, useState } from "react";

import { Calc } from "@/components/Calc/Calc";

import './StartUrlPage.css'
import { App } from "antd";
import { themeParams, /*useLaunchParams*/ } from "@telegram-apps/sdk-react";
import { calcPosh, Code, getCode } from "@/components/Calc/functions";


const txtColor = import.meta.env.VITE_TXT_COLOR;
const txtColorRed = import.meta.env.VITE_TXT_COLOR_RED;

export interface StartUrlPageProps {
  startParam?: string;
}

export const StartUrlPage: FC<StartUrlPageProps> = (props) => {
  //const LP = useLaunchParams();
  //const SP = LP.initData?.startParam;

  //let startParam = SP || '';
  console.log('%cstartParam: %o', `color: ${txtColorRed}`, props.startParam);

  let code: Code|undefined = {
    benefitsSwitch: false,
    discount30Switch: false,
    discount50Switch: false,
    sou: '',
    arb: ''
  };

  code = getCode( props.startParam || '' );
  console.log('%ccode: %o', `color: ${txtColorRed}`, code);
  
  const startsum = code?.sou !=='' ? code?.sou.replace(/ /g,'') : code?.arb !=='' ? code?.arb.replace(/ /g,'') || '': '';

  const courtType = code?.arb !=='' ? 'arb' : 'obsh' ;

  const startposh = calcPosh( startsum || '', courtType, code?.benefitsSwitch, code?.discount30Switch, code?.discount50Switch);
  
  console.log('%cstartsum: %o', `color: ${txtColor}`, startsum);
  console.log('%cstartposh: %o', `color: ${txtColor}`, startposh);

  const [sum, setSum] = useState(startsum);
  const [posh, setPosh] = useState(startposh || '');
  
  //themeParams.mount();

  return (
    <>
    <div className="contentWrapper">
      <App>
        <Calc 
          header={courtType === 'obsh' ?
            <>Размер государственной пошлины<br/>при обращении в суды общей юрисдикции</>:
            <>Размер государственной пошлины<br/>при обращении в арбитражные суды</>
          }
          footer={  courtType === 'obsh' ?
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
