import {
  useEffect, useRef, useState,
  SetStateAction,
  type FC, type ReactNode
} from 'react';

import { init, miniApp, popup, shareURL, viewport } from '@telegram-apps/sdk';

import { useSignal, useLaunchParams } from '@telegram-apps/sdk-react';

import { PrimeReactProvider } from 'primereact/api';
import { InputNumber } from 'primereact/inputnumber'; // https://primereact.org/inputnumber/
import "primereact/resources/themes/lara-dark-blue/theme.css";
         
import { Typography, Button, List, Switch } from 'antd';

const { Title, Text } = Typography;

import { Copy, QrCode, Share, Trash } from 'react-bootstrap-icons';

import {
  CenterPopup as MobPopup,
  ConfigProvider as MobConfigProvider,
  AutoCenter as MobAutoCenter,
  Dialog as MobDialog,
} from 'antd-mobile';

import ruRU from 'antd-mobile/es/locales/ru-RU'

import {
  backgroundColor,
  hintColor,
  secondaryBgColor,
  sectionHeaderTextColor,
} from "../ConfigProvider/variables";

import { Link } from '../Link/Link';

import './Calc.css';
import { calcPosh, Code, copyToClipboard, copyToClipboardProps, fixed2, /*GenerateQRCode, */human, sharelink } from './functions';
import { stepArbText, stepSouText } from './variables';
import { QRCode_Styling } from '../QRCode/QRCode';

const txtColor = import.meta.env.VITE_TXT_COLOR;

export const PrimeReactFlex = ({ children }: { children: ReactNode }) => {
  return (
    <div className="p-inputgroup flex-1">
      {children}
    </div>
  )
}

export interface CalcProps {
  header?: ReactNode;
  footer?: ReactNode;
  sum?: ReactNode;
  posh?: ReactNode;
  setSum?: React.Dispatch<React.SetStateAction<string>>;
  setPosh?: React.Dispatch<React.SetStateAction<string>>;
  courtType?: string;
  code?: Code;
}

export const Calc: FC<CalcProps> = ({ 
  header,
  footer,
  sum,
  posh,
  setSum,
  setPosh,
  courtType,
  code
}) => {

  const LP = useLaunchParams();
  const userid = LP.initData?.user?.id.toString() || '';
  console.log('%cLaunchParams: %o', `color: ${txtColor}`, LP);

  console.log('%ccode: %o', `color: pink`, code);
  const startSum = code?.sou !=='' ? code?.sou.replace(/ /g,'') : code?.arb !=='' ? code?.arb.replace(/ /g,''):'';
  const startCalc = calcPosh(startSum||'', courtType||'obsh', code?.benefitsSwitch, code?.discount30Switch, code?.discount50Switch);

  console.log('%cstartCalc: %o', `color: ${txtColor}`, startCalc);
  const MA = miniApp;
  const VP = viewport;
  const PU = popup;

  if (!MA.isCssVarsBound) MA.bindCssVars();

  const MAisMounted = useSignal(MA.isMounted);
  const VPisMounted = useSignal(VP.isMounted);
  const PUisOpened = useSignal(PU.isOpened);

  const stepText = courtType === 'obsh' ? stepSouText : stepArbText;

  const [benefitsSwitch, setBenefitsSwitch] = useState<boolean>(code?.benefitsSwitch || false);

  const [discount30Switch, setDiscount30Switch] = useState<boolean>(code?.discount30Switch || false);
  const [discount30Sum, setDiscount30Sum] = useState<number>(Number(startCalc.discount30));

  const [discount50Switch, setDiscount50Switch] = useState<boolean>(code?.discount50Switch || false);
  const [discount50Sum, setDiscount50Sum] = useState<number>(Number(startCalc.discount50));

  const [exceed, setExceed] = useState<number>(Number(startCalc.exceed));
  const [percent, setPercent] = useState<number>(Number(startCalc.percent));
  const [fix, setFix] = useState<number>(Number(startCalc.fix));

  const [step, setStep] = useState<number>(Number(startCalc.step));

  const inputSumEl = useRef<InputNumber>(null);
  const buttonCopy = useRef<any>(null);
  const buttonShare = useRef<any>(null);
  const buttonQrCode = useRef<any>(null);

  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    console.log('%cМини приложение ' + (MAisMounted ? 'смонтировано.' : 'размонтировано.'), MAisMounted ? 'color: lightgreen': 'color: #FFC0CB'); 
    console.log('%cОбласть просмотра ' + (VPisMounted ? 'смонтирована.' : 'размонтирована.'), VPisMounted ? 'color: lightgreen': 'color: #FFC0CB'); 
    console.log('%cВсплывающее окно ' + (PUisOpened ? 'открыто.' : 'закрыто.'), PUisOpened ? 'color: lightgreen': 'color: #FFC0CB');
  }, [
    MAisMounted,
    VPisMounted,
    PUisOpened,
  ]);

  init(); console.log('%cinit()',`color: ${txtColor}`);
  MA.mount(); console.log('%cminiApp.mount(): %o', `color: ${txtColor}`, MA.isMounted());

  function buttonsDisabled(state: boolean) {
    try {
      buttonCopy.current.disabled = state;
    } catch (error) { }
    try {
      buttonShare.current.disabled = state;
    } catch (error) { }
    try {
      buttonQrCode.current.disabled = state;
    } catch (error) { }
  }

  useEffect(() => {
    // установка первоначальных состояний кнопок
    buttonsDisabled(true);
  },[]);

  /**
   * If the popup is supported and not already opened, opens a popup with an Ok button and a cancel button.
   * If the popup is not supported, sets the popupVisible state to true.
   * @param value - The content to be displayed in the popup.
   */
  async function showClipboard(value: any) {
    console.log('%c--- value: %o', `color: ${txtColor}`, value);
    console.log('%c--- popup: %o', `color: ${txtColor}`, PU);
    
    if (PU.isSupported()) {
      console.log('%c--- popup.isSupported(): %o', `color: ${txtColor}`, PU.isSupported());
      
      if (!PU.isOpened()) {
        console.log('%c--- popup.isOpened(): %o', `color: ${txtColor}`, PU.isOpened());
    
        const promise = PU.open({
          title: 'Буфер обмена',
          message: value,
          buttons: [
            { id: 'btnproceed', type: 'default', text: 'Ok' },
            { id: 'btncancel', type: 'cancel' },
          ]
        }).then((buttonId: string|null) => {
          console.log('%c--- buttonId: %o', `color: ${txtColor}`, buttonId);  
        }).catch((error: unknown)=>{
          if (error instanceof Error) {
            
            if (error.message.includes('ERR_ALLREADY_CALLED')) {
              console.log('%cОкно уже открыто.','color: #FFC0CB');
            }
          } else {
            console.log('%cНеизвестная ошибка: %o',error);
          }
        });
        let buttonId = await promise;
        console.log('%c--- buttonId: %o', `color: ${txtColor}`, buttonId);  
      }
      
    } else {
      setPopupVisible(true);      
    }
  }

  useEffect(() => {
    /**
     * 
     * 
     * ПРОВЕРИТЬ НА ПОВТОРЫ И ПЕРЕПИСАТЬ С УЧЕТОМ ИЗМЕНЕНИЯ calcPosh
     * 
     * 
     */
  
    if (setPosh) {

      let calc = calcPosh(sum?.toString()||'', courtType||'', benefitsSwitch, discount30Switch, discount50Switch);

      if (sum === '' || sum === null) {
        setPosh(''); setStep(0); setExceed(0); setFix(0); setPercent(0);
      } else {
        if (Number(calc.gosp) >= 0) {
          buttonsDisabled(false);
        }
        if (benefitsSwitch) {
          if (Number(calc.gosp) >= 0) {
            if (setPosh) {
              setPosh(human(calc.gosp));
              setStep(calc.step);
              setExceed(Number(calc.exceed));
              setFix(Number(calc.fix));
              setPercent(Number(calc.percent));
            }
          } else {
            if (setPosh) {
              setPosh('0'); setStep(calc.step); setExceed(0); setFix(0); setPercent(0);
            }
          }
        } else if (discount30Switch) {
          if (setPosh) {
            if (benefitsSwitch) {
              setPosh(human(calc.gosp));
              setStep(calc.step);
              setExceed(Number(calc.exceed));
              setFix(Number(calc.fix));
              setPercent(Number(calc.percent));
            }
            if (discount30Switch) {
              setPosh(human(calc.gosp));
              setStep(calc.step);
              setExceed(Number(calc.exceed));
              setFix(Number(calc.fix));
              setPercent(Number(calc.percent));
            }
          }
        } else if (discount50Switch) {
          if (setPosh) {
            if (benefitsSwitch) {
              setPosh(human(calc.gosp));
              setStep(calc.step);
              setExceed(Number(calc.exceed));
              setFix(Number(calc.fix));
              setPercent(Number(calc.percent));
            }
            if (discount50Switch) {
              setPosh(human(calc.gosp));
              setStep(calc.step);
              setExceed(Number(calc.exceed));
              setFix(Number(calc.fix));
              setPercent(Number(calc.percent));
            }
          }
        } else {
          if (setPosh) {
            const _calc = calcPosh(sum?.toString()||'', courtType||'', benefitsSwitch, discount30Switch, discount50Switch); 
            setPosh(_calc.gosp.toString());
            setStep(_calc.step);
            setExceed(Number(_calc.exceed));
            setFix(Number(_calc.fix));
            setPercent(Number(_calc.percent));
          }
        }
      }
    }

  },[benefitsSwitch, discount30Switch, discount50Switch]);
  
  const mockContentWithCloseIcon = (
    <>
      <div style={{ padding: '40px 20px 20px' }}><MobAutoCenter>Сумма пошлины: {human(posh)} руб.</MobAutoCenter></div>
      <MobAutoCenter>
        <Button
          onClick={()=>setPopupVisible(false)}
        >
          Ok
        </Button>
      </MobAutoCenter>
    </>
  )
 
  return (
    <>
      <PrimeReactProvider value={{unstyled: false}}>
        <MobConfigProvider
          locale={ruRU}
        >
          <List
            id={'courtType'}
            header={
              <Title
                level={5}
                className='listHeader'>
                <Text
                  type='success'
                >
                  {header}
                </Text>
              </Title>
            }
            footer={
              <div
                className='listFooter'
              >
                <Text
                  style={{color: sectionHeaderTextColor}}
                >
                  {footer}
                </Text>
              </div>
            }
          >
            <List.Item style={{width: '100%'}}>
              <PrimeReactFlex>
                <InputNumber 
                  id='sum'
                  ref={inputSumEl}
                  value={Number(fixed2(sum?.toString()||''))}
                  onValueChange={(e) => {
                    let value = e.value;
                    if (setSum !== undefined) {
                      if (value === null || value === 0) {
                        setSum('');
                      }
                      if (value) {
                        setSum(fixed2(value.toString()));
                      }
                      
                      let calc = calcPosh(value?.toString()||'', courtType || '', benefitsSwitch, discount30Switch, discount50Switch);
                      let gosp = calc.gosp;
                      console.log('%c=== calc: %o', `color: ${txtColor}`, calc);

                      let discount30Sum: SetStateAction<number> = Number(calc.discount30);
                      let discount50Sum: SetStateAction<number> = Number(calc.discount50);
                      
                      setDiscount30Sum(discount30Sum);
                        
                      if (courtType === 'arb') {
                        setDiscount50Sum(discount50Sum);
                      }
                      
                      const step: SetStateAction<number> = calc.step;
                      setStep(step);
 
                      if (setPosh) {
                        if (sum === '0' || sum === '' || sum === null || sum === undefined || sum === 0) {
                          setPosh('');
                        } else {
                          setPosh(human((Number(gosp||0)).toFixed(0)));
                        } 
                        console.log('%c=== sum: %o', `color: ${txtColor}`, sum);
                      }
                      
                    }
                    return sum;
                  }}
                  onKeyUpCapture={(e: any)=>{
                    const trimed = e.target.value.replaceAll(String.fromCharCode(160), '');
                    const value: SetStateAction<string> = trimed;
                    if (setSum) {
                      console.log('%c=== onKeyUpCapture: %o', `color: ${txtColor}`, value);
                      setSum(value);
                      
                      const calc = calcPosh(value?.toString(), courtType||'', benefitsSwitch, discount30Switch, discount50Switch);
                      const gosp = calc.gosp;
                      
                      console.log('%c=== courtType: %o', `color: ${txtColor}`, courtType);
                      console.log('%c=== calc: %o', `color: ${txtColor}`, calc);
                                      
                      const discount30Sum: SetStateAction<number> = Number(calc.discount30);
                      const discount50Sum: SetStateAction<number> = Number(calc.discount50);
                      
                      const exceed = Number(calc.exceed);
                      const fix = Number(calc.fix);
                      const percent = Number(calc.percent);
                      
                      setExceed(exceed);
                      setFix(fix);
                      setPercent(percent);
                        
                      if (courtType === 'arb') {
                        setDiscount50Sum(discount50Sum);
                      }

                      let step: SetStateAction<number> = calc.step;
                      
                      if (setPosh) {
                        console.log('%c=== gosp: %o', `color: ${txtColor}`, gosp);
                      
                        if (value === '0' || value === '' || value === null || value === undefined ) {
                          setPosh('');
                          setDiscount30Sum(0);
                          setDiscount50Sum(0);
                          setStep(0);
                          buttonsDisabled(true);
                          
                        } else {
                          setPosh(human((Number(gosp||0)).toFixed(0)));
                          setDiscount30Sum(discount30Sum);
                          if (courtType === 'arb') {
                            setDiscount50Sum(discount50Sum);
                          }
                          setStep(step);
                          if (Number(gosp) > 0) {
                            buttonsDisabled(false);
                          }
                        }
                        
                        
                        console.log('%c=== sum: %o', `color: ${txtColor}`, sum);
                      }
                    }
                  }}
                  style={{
                    height: '48px',
                    borderWidth: '2px',
                    borderRadius: '16px',
                    maxWidth: '100vw',
                  }}
                  className='p-inputnumber-input'
                  locale='ru-ru'
                  maxFractionDigits={2}
                />
                  <Button
                    id='btnClear'
                    type='primary'
                    style={{
                      marginLeft: '8px',
                      height: '48px',
                      borderWidth: '2px',
                      width: '48px',
                      borderRadius: '16px',
                      
                    }}
                    onClick={() => {
                      if (setSum) {
                        setSum('');
                        setStep(0);
                        setExceed(exceed);
                        setFix(fix);
                        setPercent(percent);
                        setBenefitsSwitch(false);
                        setDiscount30Switch(false);
                        setDiscount50Switch(false);
                        buttonsDisabled(true);
                      }
                      if (setPosh) setPosh('');
                    }}
                    tabIndex={-1}
                    disabled={!sum || sum === '0'}
                  >
                    <Trash/>
                  </Button>
              </PrimeReactFlex>

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
                        human(discount30Sum) : '0'} руб.</Text>
                    <br/>
                    {
                      courtType === 'arb' ?
                      <>
                        <Text 
                        style={
                          {color: hintColor}
                        } className='unselectable'>Скидка, 50%: {discount50Switch ? 
                          human(discount50Sum) : '0'} руб.</Text>
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
                            {discount30Switch ? ' - ' + human(discount30Sum) + 'руб.' : ''}
                            {discount50Switch ? ' - ' + human(discount50Sum) + 'руб.': ''}
                        </Text>
                        <br/>
                      </>
                      :
                      <></>
                    }
                    <Text
                      type='success'
                      className='unselectable'
                    >
                      Сумма пошлины: { 
                        posh ? human(posh) : '0'
                      } руб.
                    </Text>
                  </>
                }  
              />
            </List.Item>
            <List.Item style={{width: '100%'}}>
              <PrimeReactFlex>
                <Button
                    id='btnCopy'
                    ref={buttonCopy}
                    type='primary'
                    style={{
                      margin: 'auto',
                      height: '46px',
                      borderWidth: '2px',
                      borderRadius: '16px',
                      width: '95%',
                    }}
                    onClick={() => {
                      const clipboard = window.navigator.clipboard;
                        
                      const sou = courtType === 'obsh' ? human(sum) : '';
                      const arb = courtType === 'arb' ? human(sum) : '';
                      const url = sharelink(sou, arb, benefitsSwitch, discount30Switch, discount50Switch, userid); 
                      
                      const msg = posh ? 'Сумма пошлины: ' + posh.toString() + ' руб.,\nрасчет: ' + url + '' : '';
                      //Сумма пошлины: 64 311 руб.,
                      //расчет: https://t.me/tgfee_bot/app?startapp=clcg5758755hbro99281932
                      
                      const data: copyToClipboardProps = {text: msg};
                      copyToClipboard(data);
                      
                      /*
                      if (popup.isSupported()) {popup.open({
                        title: 'Буфер обмена',
                        message: 'Скопировано в буфер обмена',
                        buttons: [
                          { id: 'btnproceed', type: 'default', text: 'Ok' },
                          { id: 'btncancel', type: 'cancel' },
                        ]
                      });}
                      */
                      showClipboard(posh?.toString());

                      if (clipboard) {
                        if (posh) {
                          showClipboard(posh?.toString());
                        }
                      }
                    }}
                    tabIndex={-1}
                    //disabled={!posh || Number(posh) <= 0 || posh === '0' ? true : false}
                  >
                    <Copy />
                  </Button>
                  { LP.platform === 'android' || LP.platform === 'ios' ?
                    <Button
                      id='btnShare'
                      ref={buttonShare}
                      type='primary'
                      style={{
                        marginLeft: '8px',
                        height: '46px',
                        borderWidth: '2px',
                        width: '46px',
                        borderRadius: '16px',
                      }}
                      onClick={() => {
                        //const LP = useLaunchParams();
  
                        const sou = courtType === 'obsh' ? human(sum) : '';
                        const arb = courtType === 'arb' ? human(sum) : '';
                        const url = sharelink(sou, arb, benefitsSwitch, discount30Switch, discount50Switch, userid); 
                        console.log('url: ',url);
                                  
                        try {
                          console.log('%cmainButton.onCLick',`color: ${txtColor}`);
                          
                          if (PU.isSupported()) {
                          
                            PU.open({
                                title: 'Поделиться расчетом!',
                                message: 'Для того чтобы поделиться расчетом, нажмите на кнопку Ok.',
                                buttons: [
                                  { id: 'btnproceed', type: 'default', text: 'Хорошо' },
                                  { id: 'btncancel', type: 'cancel' },
                                ],
                              }).then((buttonId: string|null) => {
                                if (buttonId === 'btnproceed') {
                                  //const url = 'https://t.me/GosPoshlinaDevBot/poshlina';
                                  
                                  console.log(url);
                                  shareURL(`Посмотрите мое приложение ${url}`);
                                } else {
                                  console.log(
                                    buttonId === null 
                                      ? 'Пользователь не нажимал кнопок.'
                                      : `Пользователь нажал кнопку с ID "${buttonId}"`
                                  );
                                }
                              }).catch((error: unknown)=>{
                                if (error instanceof Error) {
                                  //console.log(error.message);
                                  if (error.message.includes('ERR_ALLREADY_CALLED')) {
                                    console.log('%cОкно уже открыто.','color: #FFC0CB');
                                  }
                                } else {
                                  console.log('Неизвестная ошибка: ',error);
                                }
                              });
                      
                            console.log(PU.isOpened); // true
                            
                            console.log('Всплывающее окно открыто.');
                          }
                        } catch (error) {
                          console.error('Ошибка при открытии всплывающего окна:', error);
                            
                        }
                      }}
                      tabIndex={-1}
                      //disabled={!posh || Number(posh) <= 0 || posh === '0' ? true : false}
                    >
                      <Share />
                    </Button>:<></>
                  }
                  {/*<QRCode text={'https://yandex.ru'} props={{
                          width: 240,
                          margin: 2,
                          color: {
                            light: backgroundColor,
                            dark: accentTextColor
                          }
                        }}
                          setBlob={setBlob}
                        />*/}
                  <Button
                    id='btnQrCode'
                    ref={buttonQrCode}
                    type='primary'
                    style={{
                      marginLeft: '8px',
                      height: '46px',
                      borderWidth: '2px',
                      width: '46px',
                      borderRadius: '16px',
                    }}
                    onClick={() => {
                      const sou = courtType === 'obsh' ? human(sum) : '';
                      const arb = courtType === 'arb' ? human(sum) : '';
                      const url = sharelink(sou, arb, benefitsSwitch, discount30Switch, discount50Switch, userid); 
                      console.log('url: ',url);
                        
                      MobDialog.show({
                        content: <QRCode_Styling text={url}/>, 
                        closeOnAction: true,
                        actions: [
                          {
                            key: 'close',
                            text: 'Закрыть',
                            onClick: () => {
                              console.log('allgood');
                              //console.log(blob);
                            },
                            style: {
                              fontSize: '14px',
                            }
                          }
                        ],
                        bodyStyle: {
                          backgroundColor: backgroundColor,
                        }
                      })
                    }}
                    tabIndex={-1}
                    //disabled={!posh || Number(posh) <= 0 || posh === '0' ? true : false}
                  >
                    <QrCode />
                  </Button>
                
                </PrimeReactFlex>
              
            </List.Item>
            {/*
            <List.Item style={{width: '100%'}}>
              <QRCode text={'https://yandex.ru'} props={{
                width:400,
                margin: 2,
                color: {
                  dark: backgroundColor,
                  light: accentTextColor
                }
                }}/>
            </List.Item>
            */}
          </List>
          <MobPopup
            visible={popupVisible}
            onMaskClick={() => setPopupVisible(false)}
            onClose={() => setPopupVisible(false)}
            bodyStyle={{
              height: '20vh',
              width: '100vw',
              backgroundColor: secondaryBgColor
            }}
            showCloseButton={true}
          >
            {mockContentWithCloseIcon}
          </MobPopup>
        </MobConfigProvider>
      </PrimeReactProvider>
    </>
  )};