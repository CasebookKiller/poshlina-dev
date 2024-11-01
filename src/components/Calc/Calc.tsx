
import { SetStateAction, useEffect, useRef, useState, type FC, type ReactNode} from 'react';

import { popup } from '@telegram-apps/sdk';

import { PrimeReactProvider } from 'primereact/api';

import { InputNumber } from 'primereact/inputnumber'; // https://primereact.org/inputnumber/
import "primereact/resources/themes/lara-dark-blue/theme.css";
         
import { Typography, Button, List, Switch, Space } from 'antd';

const { Title, Text } = Typography;

import { Copy } from 'react-bootstrap-icons';

import {
  CenterPopup as MobPopup,
  Button as MobButton,
  ConfigProvider as MobConfigProvider,
  //setDefaultConfig as MobSetDefaultConfig
} from 'antd-mobile';
import ruRU from 'antd-mobile/es/locales/ru-RU'

import {
  hintColor,
  sectionHeaderTextColor,
  textColor,
} from '@/components/configprovider/variables';

import { Link } from '../Link/Link';

import './Calc.css';
import { calcPosh, copyToClipboard, copyToClipboardProps, fixed2, human } from './functions';
import { stepArbText, stepSouText } from './variables';

export interface CalcProps {
  header?: ReactNode;
  footer?: ReactNode;
  sum?: ReactNode;
  posh?: ReactNode;
  setSum?: React.Dispatch<React.SetStateAction<string>>;
  setPosh?: React.Dispatch<React.SetStateAction<string>>;
  courtType?: string;
}

export const Calc: FC<CalcProps> = ({ header, footer, sum, posh, setSum, setPosh, courtType }) => {
  const stepText = courtType === 'obsh' ? stepSouText : stepArbText;

  const [benefitsSwitch, setBenefitsSwitch] = useState<boolean>(false);

  const [discount30Switch, setDiscount30Switch] = useState<boolean>(false);
  const [discount30, setDiscount30] = useState<number>(0);

  const [discount50Switch, setDiscount50Switch] = useState<boolean>(false);
  const [discount50, setDiscount50] = useState<number>(0);

  //const [base, setBase] = useState<number>(0);
  const [exceed, setExceed] = useState<number>(0);
  const [percent, setPercent] = useState<number>(0);
  const [fix, setFix] = useState<number>(0);

  const [step, setStep] = useState<number>(0);

  const inputSumEl = useRef<InputNumber>(null);

  const [popupVisible, setPopupVisible] = useState(false);

  /*const onKeyPress = (e: any) => {
    if (e.target.value === '') {
      if (setPosh) setPosh('');
    }
    const specialCharRegex = new RegExp("[0-9@.' ,-]");
    const pressedKey = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (!specialCharRegex.test(pressedKey)) {
      e.preventDefault();
      return false;
    }
  }*/


  async function showClipboard(value: any) {
    console.log('--- value: ', value);
    if (popup.isSupported()) {
      const promise = popup.open({
        title: 'Буфер обмена',
        message: value,
        buttons: [
          { id: 'btnproceed', type: 'default', text: 'Ok' },
          { id: 'btncancel', type: 'cancel' },
        ]
      });
      let buttonId = await promise;
      console.log('--- buttonId: ', buttonId);
    } else {
      setPopupVisible(true);      
    }
  }

  useEffect(() => {
  
    if (setPosh) {
      let calc = calcPosh(sum, courtType||'');

      if (sum === '' || sum === null) {
        setPosh('');
        setStep(0);
        //setBase(0);
        setExceed(0);
        setFix(0);
        setPercent(0);
      } else {
        if (benefitsSwitch) {
          setPosh('');
          if ((Number(calc.gosp) - calc.benefits) >= 0) {
            if (setPosh) {
              let result = Number(fixed2(calc.gosp)) - calc.benefits; 
              setPosh(human(result));
              setStep(calc.step);
              //setBase(Number(calc.base));
              setExceed(Number(calc.exceed));
              setFix(Number(calc.fix));
              setPercent(Number(calc.percent));
            }
          } else {
            if (setPosh) {
              setPosh('0');
              setStep(calc.step);
              //setBase(0);
              setExceed(0);
              setFix(0);
              setPercent(0);
            }
          }
        } else if (discount30Switch) {
          if (setPosh) {
            if (benefitsSwitch) {
              let result = Number(fixed2(calc.gosp)) - calc.benefits; 
              setPosh(human(result));
              setStep(calc.step);
              //setBase(Number(calc.base));
              setExceed(Number(calc.exceed));
              setFix(Number(calc.fix));
              setPercent(Number(calc.percent));
            }
            if (discount30Switch) {
              let result = Number(calc.gosp) - Number(calc.discount30);
              setPosh(human(result.toFixed(2)));
              setStep(calc.step);
              //setBase(Number(calc.base));
              setExceed(Number(calc.exceed));
              setFix(Number(calc.fix));
              setPercent(Number(calc.percent));
            }
          }
        } else if (discount50Switch) {
          if (setPosh) {
            if (benefitsSwitch) {
              let result = Number(fixed2(calc.gosp)) - calc.benefits; 
              setPosh(human(result));
              setStep(calc.step);
              //setBase(Number(calc.base));
              setExceed(Number(calc.exceed));
              setFix(Number(calc.fix));
              setPercent(Number(calc.percent));
            }
            if (discount50Switch) {
              console.log(' === posh: ', Number(calc.gosp));
              console.log(' === discount: ', calc.discount50);
              let result = Number(calc.gosp) - Number(calc.discount50);
              setPosh(human(result.toFixed(2)));
              setStep(calc.step);
              //setBase(Number(calc.base));
              setExceed(Number(calc.exceed));
              setFix(Number(calc.fix));
              setPercent(Number(calc.percent));
            }
          }
        } else {
          if (setPosh) {
            setPosh(calcPosh(sum, courtType||'').gosp.toString());
            setStep(calcPosh(sum, courtType||'').step);
            //setBase(Number(calcPosh(sum, courtType||'').base));
            setExceed(Number(calcPosh(sum, courtType||'').exceed));
            setFix(Number(calcPosh(sum, courtType||'').fix));
            setPercent(Number(calcPosh(sum, courtType||'').percent));
          }
        }
      }
    }
  },[benefitsSwitch, discount30Switch, discount50Switch]);

  const mockContent = (
    <div style={{ padding: 20 }}>{'content'}</div>
  )
  
  const mockContentWithCloseIcon = (
    <div style={{ padding: '40px 20px 20px' }}>{'content'}</div>
  )

  return(
    <>
      <PrimeReactProvider value={{unstyled: false}}>

      <List
        id={'courtType'}
        header={
          <Title level={5}>
            <Text type='success'>{header}</Text>
          </Title>
        }
        footer={
          <Text style={{color: sectionHeaderTextColor}}>{footer}</Text>
        }
      >
        <List.Item>
          <InputNumber 
            id='sum'
            ref={inputSumEl}
            value={Number(fixed2(sum?.toString()||''))}
            onValueChange={(e) => {
              let value = e.value;
              if (setSum !== undefined) {
                if (value === null) {
                  setSum('');
                }
                if (value) {
                  setSum(fixed2(value.toString()));
                }
                let calc = calcPosh(value, courtType||'');
                let gosp = calc.gosp;
                let discount30: SetStateAction<number> = Number(calc.discount30);
                setDiscount30(discount30);
                let discount50: SetStateAction<number> = Number(calc.discount50);
                  
                if (courtType === 'arb') {
                  setDiscount50(discount50);
                }
                
                let step: SetStateAction<number> = calc.step;
                setStep(step);
                
                let result;
                if (benefitsSwitch) {
                  result = Number(fixed2(gosp)) - calc.benefits;
                }
                if (discount30Switch) {
                  result = Number(gosp) - Number(discount30);
                }
                if (discount50Switch) {
                  result = Number(gosp) - Number(discount50);
                }

                if (setPosh) {
                  if (sum === null) {
                    setPosh('');
                  } else if (sum !== '') {
                    setPosh(human((result||0).toFixed(2)));
                  }
                  console.log('=== sum: ', sum);
                }
              }
              return sum;
            }}
            onKeyUpCapture={(e: any)=>{
              const trimed = e.target.value.replaceAll(String.fromCharCode(160), '');
              const value: SetStateAction<string> = trimed;
              if (setSum) {
                setSum(value);
                
                let calc = calcPosh(value, courtType||'');
                console.log('=== courtType: ', courtType);
                console.log('=== calc: ', calc);
                let gosp = calc.gosp;
                let discount30: SetStateAction<number> = Number(calc.discount30);
                let discount50: SetStateAction<number> = Number(calc.discount50);
                //let base = Number(calc.base);
                let exceed = Number(calc.exceed);
                let fix = Number(calc.fix);
                let percent = Number(calc.percent);
                //setBase(base);
                setExceed(exceed);
                setFix(fix);
                setPercent(percent);
                  
                if (courtType === 'arb') {
                  setDiscount50(discount50);
                }

                let result = Number(gosp);
                if (benefitsSwitch) {
                  result = Number(fixed2(gosp)) - calc.benefits;
                }
                if (discount30Switch) {
                  result = Number(gosp) - Number(discount30);
                }
                if (discount50Switch) {
                  result = Number(gosp) - Number(discount50);
                }

                let step: SetStateAction<number> = calc.step;
                
                if (setPosh) {
                  if (sum === null) {
                    setPosh('');
                    setDiscount30(0);
                    setDiscount50(0);
                    setStep(0);
                  } else if (sum !== '') {
                    setPosh(human((result||0).toFixed(2)));
                    setDiscount30(discount30);
                    if (courtType === 'arb') {
                      setDiscount50(discount50);
                    }
                    setStep(step);
                  }
                  console.log('=== sum: ', sum);
                }

              }
            }}
            className='p-inputnumber-input'
            locale='ru-ru'
            maxFractionDigits={2}
          />
        </List.Item>
        <List.Item
          onClick={() => {
            setBenefitsSwitch(!benefitsSwitch);
            if (discount30Switch === true) {
              setDiscount30Switch(false);
            }
            if (discount50Switch === true) {
              setDiscount50Switch(false);
            }
          }}
          className={'hoverable'}
        >
          <List.Item.Meta
            title={<Text type={'success'}>Льгота {courtType === 'obsh' ? '-25 000': '-55 000'} р.</Text>}
            description={
            courtType === 'obsh' ?
            <>
              <Text style={{color: hintColor}} className='unselectable'>
                <Link to='/' tabIndex={-1}>Льготные категории</Link> плательщиков определены п.2, п.3 ст.333.36 НК РФ.
              </Text>
            </>
            :
            <>
              <Text style={{color: hintColor}} className='unselectable'>
                <Link to='/' tabIndex={-1}>Льготные категории</Link> плательщиков определены п.2, п.3 ст.333.37 НК РФ.
              </Text>
            </>
            }  
          />
          <Switch
            checked={benefitsSwitch}
            tabIndex={-1}
          />
        </List.Item>
        { courtType === 'obsh' ? 
          <>
            <List.Item
              onClick={() => {
                setDiscount30Switch(!discount30Switch);
                if (benefitsSwitch === true) {
                  setBenefitsSwitch(false);
                }
                if (discount50Switch === true) {
                  setDiscount50Switch(false);
                }
              }}
              className={'hoverable'}
            >
              <List.Item.Meta
                title={<Text type={'success'}>Скидка в 30%</Text>}
                description={
                  <>
                    <Text style={{color: hintColor}} className='unselectable'>
                      <Link to='/' tabIndex={-1}>Ситуации</Link> для применения скидки в 30% определены пп.10 п.1 ст.333.19 НК РФ.
                    </Text>
                  </>}  
              />
              <Switch
                checked={discount30Switch}
                tabIndex={-1}
              />
            </List.Item>
          </>
          :
          <>
            <List.Item
              onClick={() => {
                setDiscount30Switch(!discount30Switch);
                if (benefitsSwitch === true) {
                  setBenefitsSwitch(false);
                }
                if (discount50Switch === true) {
                  setDiscount50Switch(false);
                }
              }}
              className={'hoverable'}
            >
              <List.Item.Meta
                title={<Text type={'success'}>Скидка в 30%</Text>}
                description={
                  <>
                    <Text style={{color: hintColor}} className='unselectable'>
                      <Link to='/' tabIndex={-1}>Ситуации</Link> для применения скидки в 30% определены пп.13 п.1 ст.333.21 НК РФ.
                    </Text>
                  </>}  
              />
              <Switch
                checked={discount30Switch}
                tabIndex={-1}
              />
            </List.Item>
            <List.Item
              onClick={() => {
                setDiscount50Switch(!discount50Switch);
                if (benefitsSwitch === true) {
                  setBenefitsSwitch(false);
                }
                if (discount30Switch === true) {
                  setDiscount30Switch(false);
                }
              }}
              className={'hoverable'}
            >
              <List.Item.Meta
                title={<Text type={'success'}>Скидка в 50%</Text>}
                description={
                  <>
                    <Text style={{color: hintColor}} className='unselectable'>
                      <Link to='/' tabIndex={-1}>Ситуации</Link> для применения скидки в 50% определены пп.9 п.1 ст.333.21 НК РФ.
                    </Text>
                  </>}  
              />
              <Switch
                checked={discount50Switch}
                tabIndex={-1}
              />
            </List.Item>
          </>
        }
        
        <List.Item>
          <List.Item.Meta
            title={<Text type={'success'}>Расчёт пошлины</Text>}
            description={
              <>
                <Text 
                  style={
                    {color: hintColor}
                  } className='unselectable'>Цена иска: {human(sum)|| '0'} руб.</Text>
                <br/>
                <Text 
                  style={
                    {color: hintColor}
                  } className='unselectable'>Льгота: {benefitsSwitch ? courtType === 'obsh' ? '25 000' : '55 000' : '0'} руб.</Text>
                <br/>
                <Text 
                  style={
                    {color: hintColor}
                  } className='unselectable'>Скидка, 30%: {discount30Switch ? 
                    human(discount30) : '0'} руб.</Text>
                <br/>
                {
                  courtType === 'arb' ?
                  <>
                    <Text 
                    style={
                      {color: hintColor}
                    } className='unselectable'>Скидка, 50%: {discount50Switch ? 
                      human(discount50) : '0'} руб.</Text>
                    <br/>
                  </>
                  :<></>
                }
                {step !== 0 ?
                  <>
                    <Text 
                      style={
                        {color: hintColor}
                      }
                      className='unselectable'
                    >
                      Формула ({stepText[step].step}):<br/> {human(fix)} руб. {
                        percent !== 0 ? 
                          <> + {human(percent)}% * {human(exceed)} руб.</>
                        :
                          <></>
                        }
                        {benefitsSwitch ? courtType === 'obsh' ? ' - 25 000 руб.' : ' - 55 000 руб.' : ''}
                        {discount30Switch ? ' - ' + human(discount30) + 'руб.' : ''}
                        {discount50Switch ? ' - ' + human(discount50) + 'руб.': ''}
                    </Text>
                    <br/>
                  </>
                  :
                  <></>
                }
                <Text 
                  style={
                    {color: textColor}
                  } className='unselectable'>Сумма пошлины: {human(posh) || '0'} руб.</Text>
              </>
            }  
          />
        </List.Item>
        <List.Item>  
          <Space.Compact style={{width: '100%'}}>
            <Button
              type='primary'
              style={{
              width: '100%',
              height: '46px',
              borderWidth: '2px',
              }}
              onClick={() => {
                let clipboard = window.navigator.clipboard;
                const data: copyToClipboardProps = {text: posh?.toString()||''};
                copyToClipboard(data);
                if (clipboard) {
                  if (posh) {
                    showClipboard(posh?.toString());
                  }
                }
              }}
              tabIndex={-1}
            >
              <Copy /><Text>Скопировать</Text>
            </Button>
          </Space.Compact>
        </List.Item>
      </List>
      <MobConfigProvider
        locale={ruRU}
      >
        <MobButton
          block
          color='primary'
        >Кнопка</MobButton>
      </MobConfigProvider>
      {/*
      <Section header={header} footer={footer}>
        <TGInput/>
      </Section>
      */}

      <MobPopup
        visible={popupVisible}
        onMaskClick={() => setPopupVisible(false)}
        onClose={() => setPopupVisible(false)}
        bodyStyle={{
          height: '20vh',
        }}
        showCloseButton={true}
      >
        {mockContentWithCloseIcon}
      </MobPopup>  
      </PrimeReactProvider>
      </>
    )
  };

