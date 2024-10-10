import { Input, Section } from '@telegram-apps/telegram-ui';
import type { FC, ReactNode} from 'react';

export interface CalcProps {
  header?: ReactNode;
  footer?: ReactNode;
  sum?: ReactNode;
  posh?: ReactNode;
  setSum?: React.Dispatch<React.SetStateAction<string>>;
  setPosh?: React.Dispatch<React.SetStateAction<string>>;
}

export const Calc: FC<CalcProps> = ({ header, footer, sum, posh, setSum, setPosh }) => {
  
  function human(dosum: string | number) { // разрядность
    let sum = "" + dosum;
    sum = sum.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') // разрядность
    if (sum.indexOf(".")!==-1) {						   // к десяткам копеек добавляем ноль
      const b = sum.slice(0, sum.lastIndexOf('.') + 1);
      if (b.length===2) sum+="0"
    }
    if (sum.indexOf(",")!==-1) {						   // к десяткам копеек добавляем ноль
      const b = sum.slice(0, sum.lastIndexOf(',') + 1);
      if (b.length===2) sum+="0";
    }
    sum = sum.replace(/^00\./,'0.'); // меняем 00. на 0,
    sum = sum.replace(/^00,/,'0.');
    sum = sum.replace(/\./g,','); // меняем тчк на зпт
    
    return sum;
  }

  const onKeyPress = (e: React.KeyboardEvent) => {
    //console.log(e);
    const specialCharRegex = new RegExp("[a-zA-Z0-9@.' ,-]");
    const pressedKey = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (!specialCharRegex.test(pressedKey)) {
      e.preventDefault();
      return false;
    }
  }

  function fixed2(e: string ) {
    const t = e.split(',');
    let r = '';
    if (t.length>1) {
      const n = t[0].replace(/ /g,'');
      const d = t[1].slice(0,2);
      r = n+','+d;
    } else {
      r = e.replace(/ /g,'');
    }
    return r;
  }

  return(
    <Section header={header} footer={footer}>

      <Input
        id='sum'
        header="Цена иска" 
        placeholder="Введите цену иска"
        style={{ width: '100%' }}
        onKeyUp={(e)=>onKeyPress(e)}
        onChange={(evt)=>{
          const t = evt.target.value;//fixed2(evt.target.value);
          const val = Number(t.replace(/ /g,'').replace(/,/g,'.'));
          console.log('!evt.target.value: ',human(val));
          const h = human(t.toString().replace(/ /g,'').replace(/[.]/g,',').replace(/[^\d,]+/g, '').replace(/(?<match>[,.])(?=.*\k<match>)/g, ``));
          console.log('h:', h);
          //const n = Number(h.replace(/ /g,'').replace(/,/g,'.')).toFixed(2).toString().replace(/[.]/g,',');
          //console.log('n:', n);
          
          if (setSum!==undefined) setSum(h);
          if (setPosh!==undefined) setPosh(h);
          return h;
        }}
        //defaultValue={sum?.toString()||''}
        value={sum?.toString()||''}
        onInput={(e)=>{
          fixed2(e.currentTarget.value);
        }}
        step={0.01}
      />
      <Input 
        id='posh'
        header="Размер пошлины"
        status='default'
        readOnly
        onChange={(value)=>{
          return (value);
        }}
        //defaultValue={posh?.toString()||'0'}
        value={posh?.toString()||'0'}
      />
    </Section>)
};

