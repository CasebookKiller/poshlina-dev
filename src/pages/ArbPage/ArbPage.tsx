import { FC, useState } from "react";

import { Calc } from "@/components/Calc/Calc";

import './ArbPage.css'
import { App } from "antd";
import { themeParams, /*useLaunchParams*/ } from "@telegram-apps/sdk-react";
import { calcPosh, Code, getCode } from "@/components/Calc/functions";
import { Link } from "@/components";
import { hintColor } from "@/components/init";

const txtColor = import.meta.env.VITE_TXT_COLOR;

export interface ArbPageProps {
  startParam?: string
}

export const ArbPage: FC<ArbPageProps> = ( props ) => {
  //const LP = useLaunchParams();
  //const SP = LP.initData?.startParam;

  //let startParam = SP || '';
  
  console.log('%cstartParam: %o', `color: ${txtColor}`, props.startParam);
  let code: Code|undefined = {
    benefitsSwitch: false,
    discount30Switch: false,
    discount50Switch: false,
    sou: '',
    arb: ''
  };

  code = getCode( props.startParam || '' );


  //const linkisopened = sessionStorage.getItem('linkisopened');
  //console.log('%clinkisopened: %o', `color: ${txtColor}`, linkisopened);

  //const startlinkcomplete = sessionStorage.getItem('startlinkcomplete');
  //console.log('%cstartlinkcomplete: %o', `color: ${txtColor}`, startlinkcomplete);

  //if (linkisopened === 'true' && startlinkcomplete !== 'true') {
  //  sessionStorage.setItem('startlinkcomplete', 'true');
  //  code = getCode( startParam );
  //} else {
  //  code = getCode( '' );
  //}
  
  const startsum = code?.sou !=='' ? code?.sou.replace(/ /g,'') : code?.arb !=='' ? code?.arb.replace(/ /g,'') || '': '';

  const startposh = calcPosh( startsum || '', 'obsh', code?.benefitsSwitch, code?.discount30Switch, code?.discount50Switch);
  
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
          header='Размер государственной пошлины при обращении в арбитражные суды'
          footer={<div style={{color: hintColor}}>Расчёт размера государственной пошлины производится в соответствии со <Link to='/nk333_21'>статьей 333.21 НК РФ</Link>.</div>}
          sum={sum}
          posh={String(posh)}
          setSum={(newSum) => setSum(newSum as any)} // Cast newSum to any
          setPosh={(newPosh) => setPosh(newPosh as any)} // Cast newPosh to any
          courtType="arb"
          code={code}
        />
      </App>      
    </div>
    </>
  );
};
