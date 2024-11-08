import {
  useEffect, useRef, useState,
  SetStateAction,
  type FC, type ReactNode
} from 'react';

import { init, mainButton, miniApp, popup, shareURL, viewport } from '@telegram-apps/sdk';

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
  accentTextColor,
  backgroundColor,
  buttonColor,
  buttonTextColor,
  hintColor,
  secondaryBgColor,
  sectionHeaderTextColor,
} from "@/components/ConfigProvider/variables";

import { Link } from '../Link/Link';

import './Calc.css';
import { calcPosh, copyToClipboard, copyToClipboardProps, fixed2, GenerateQRCode, human } from './functions';
import { stepArbText, stepSouText } from './variables';
import QRCode, { QRCode_Styling } from '../QRCode/QRCode';

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
}

export const Calc: FC<CalcProps> = ({ header, footer, sum, posh, setSum, setPosh, courtType }) => {

  const LP = useLaunchParams();
  const SP = LP.startParam;
  
  if (SP) {
    console.log('Параметры запуска: ', SP);
  } else {
    console.log('Без параметров запуска!');
  }
  
  const MA = miniApp;
  const MB = mainButton;
  const VP = viewport;
  const PU = popup;

  const MAisMounted = useSignal(MA.isMounted);
  const MBisMounted = useSignal(MB.isMounted);
  const MBisVisible = useSignal(MB.isVisible);
  const MBisEnabled = useSignal(MB.isEnabled);
  const VPisMounted = useSignal(VP.isMounted);
  const PUisOpened = useSignal(PU.isOpened);

  const stepText = courtType === 'obsh' ? stepSouText : stepArbText;

  const [benefitsSwitch, setBenefitsSwitch] = useState<boolean>(false);

  const [discount30Switch, setDiscount30Switch] = useState<boolean>(false);
  const [discount30, setDiscount30] = useState<number>(0);

  const [discount50Switch, setDiscount50Switch] = useState<boolean>(false);
  const [discount50, setDiscount50] = useState<number>(0);

  const [exceed, setExceed] = useState<number>(0);
  const [percent, setPercent] = useState<number>(0);
  const [fix, setFix] = useState<number>(0);

  const [step, setStep] = useState<number>(0);

  const inputSumEl = useRef<InputNumber>(null);

  const [popupVisible, setPopupVisible] = useState(false);

  const [blob , setBlob] = useState<string>('');

  let a = GenerateQRCode('https://casebookkiller.github.io/poshlina-dev',{
    width: 240,
    margin: 2,
    color: {
      light: backgroundColor,
      dark: accentTextColor
    }
  });

  console.log('a: ',a);

  useEffect(() => {
    console.log('%cМини-приложение ' + (MAisMounted ? 'смонтировано.' : 'размонтировано.'), MAisMounted ? 'color: lightgreen': 'color: #FFC0CB');
    console.log('%cГлавная кнопка ' + (MBisMounted ? 'смонтирована.' : 'размонтирована.'), MBisMounted ? 'color: lightgreen': 'color: #FFC0CB');
    console.log('%cГлавная кнопка ' + (MBisVisible ? 'показана.' : 'скрыта.'), MBisVisible ? 'color: lightgreen': 'color: #FFC0CB');
    console.log('%cГлавная кнопка ' + (MBisEnabled ? 'активна.' : 'неактивна.'), MBisEnabled ? 'color: lightgreen': 'color: #FFC0CB');
    console.log('%cОбласть просмотра ' + (VPisMounted ? 'смонтирована.' : 'размонтирована.'), VPisMounted ? 'color: lightgreen': 'color: #FFC0CB'); 
    console.log('%cВсплывающее окно ' + (PUisOpened ? 'открыто.' : 'закрыто.'), PUisOpened ? 'color: lightgreen': 'color: #FFC0CB');

    console.log('blob: ', blob);
  }, [
    MAisMounted,
    MBisMounted,
    MBisVisible,
    MBisEnabled,
    VPisMounted,
    PUisOpened,
    blob
  ]);

  init(); console.log('init()');
  MA.mount(); console.log('miniApp.mount(): ', MA.isMounted());
  
  let mainButtonParams = {
    backgroundColor: buttonColor || '#2990ff',
    textColor: buttonTextColor || '#ffffff',
    text: 'Поделиться расчетом',
    isEnabled: false,
  }
    
  /*
  if (!MB.isMounted()) {
    MB.mount();
    MB.setParams(mainButtonParams);
  }
  */
  
  if (posh !== '' || Number(posh) > 0 || posh !== undefined || posh !== null ) {
    if (!MB.isMounted()) {
      MB.mount();
      MB.setParams(mainButtonParams);
      console.log('Добавлена главная кнопка', MB);
    }
  }

  useEffect(() => {
    console.log('posh: ', posh);
    if (posh !== '' || posh !== '0' || posh !== undefined || posh !== null ) {
      MB.mount();
      MB.setParams({ text: 'Поделиться расчетом', isVisible: true, isEnabled: true });
      
    } else {
      MB.setParams({ text: 'Введите цену иска', isVisible: false, isEnabled: true });
      MB.mount();
      
    }
    MB.onClick(() => {
      try {
        console.log('mainButton.onCLick');
        PU.open({
            title: 'Поделиться расчетом!',
            message: 'Для того чтобы поделиться расчетом, нажмите на кнопку Ok.',
            buttons: [
              { id: 'btnproceed', type: 'default', text: 'Ok' },
              { id: 'btncancel', type: 'cancel' },
            ],
          })
          .then((buttonId: string|null) => {
            if (buttonId === 'btnproceed') {
              const url = 'https://t.me/GosPoshlinaDevBot/poshlina';
              shareURL(`Посмотрите мое приложение ${url}`);
            } else {
              console.log(
                buttonId === null 
                  ? 'Пользователь не нажимал кнопок.'
                  : `Пользователь нажал кнопку с ID "${buttonId}"`
              );
            }
          })
          .catch((error: unknown)=>{
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
      } catch (error) {
        console.error('Ошибка при открытии всплывающего окна:', error);
      }
    })
  }, [posh]);


  /*
  
  let mainButtonParams = {
    backgroundColor: buttonColor || '#2990ff',
    textColor: buttonTextColor || '#ffffff',
    text: 'Скопировать',
    isVisible: true,
    isEnabled: false,
  }
  
  
  if (!mainButton.isMounted()) mainButton.mount();

  mainButton.setParams(mainButtonParams);
  
  useEffect(() => {
    
    if (!mainButton.isMounted()) {
      try {
        mainButton.mount();
        mainButton.setParams({
          text: 'Скопировать в буфер обмена',
          isVisible: true,
          isEnabled: true,
        })
        console.log('Смонтирована главная кнопка', mainButton);
        console.log(' --- popup.isSupported(): ', popup.isSupported());
      } catch (error: unknown) {
        if (error instanceof Error) {
          if (error.message.includes('ERR_NOT_MOUNTED')) {
            console.log('Ошибка: Главная кнопка не смонтирована');
            console.log(' --- miniApp: ', miniApp);
            console.log(' --- popup: ', popup);
            console.log(' --- mainButton: ', mainButton);          
          }
        } else {
          console.log('Неизвестная ошибка: ',error);
        }
      }
    }
  });
  */
   
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
    console.log('--- popup: ', PU);
    
    if (PU.isSupported()) {
      console.log('--- popup.isSupported(): ', PU.isSupported());
      
      if (!PU.isOpened()) {
        console.log('--- popup.isOpened(): ', PU.isOpened());
    
        const promise = PU.open({
          title: 'Буфер обмена',
          message: value,
          buttons: [
            { id: 'btnproceed', type: 'default', text: 'Ok' },
            { id: 'btncancel', type: 'cancel' },
          ]
        }).then((buttonId: string|null) => {
          console.log('--- buttonId: ', buttonId);  
        }).catch((error: unknown)=>{
          if (error instanceof Error) {
            
            if (error.message.includes('ERR_ALLREADY_CALLED')) {
              console.log('%cОкно уже открыто.','color: #FFC0CB');
            }
          } else {
            console.log('Неизвестная ошибка: ',error);
          }
        });
        let buttonId = await promise;
        console.log('--- buttonId: ', buttonId);  
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
      let calc = calcPosh(sum, courtType||'', benefitsSwitch, discount30Switch, discount50Switch);

      if (sum === '' || sum === null) {
        setPosh('');
        setStep(0);
        setExceed(0);
        setFix(0);
        setPercent(0);
      } else {
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
              setPosh('0');
              setStep(calc.step);
              setExceed(0);
              setFix(0);
              setPercent(0);
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
              console.log(' === posh: ', Number(calc.gosp));
              console.log(' === discount: ', calc.discount50);
              setPosh(human(calc.gosp));
              setStep(calc.step);
              setExceed(Number(calc.exceed));
              setFix(Number(calc.fix));
              setPercent(Number(calc.percent));
            }
          }
        } else {
          if (setPosh) {
            const _calc = calcPosh(sum, courtType||'', benefitsSwitch, discount30Switch, discount50Switch); 
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
                      
                      let calc = calcPosh(value, courtType || '', benefitsSwitch, discount30Switch, discount50Switch);
                      let gosp = calc.gosp;
                      console.log('=== calc: ', calc);

                      let discount30: SetStateAction<number> = Number(calc.discount30);
                      let discount50: SetStateAction<number> = Number(calc.discount50);
                      
                      setDiscount30(discount30);
                        
                      if (courtType === 'arb') {
                        setDiscount50(discount50);
                      }
                      
                      const step: SetStateAction<number> = calc.step;
                      setStep(step);
                      
                      /*
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
                      */

                      if (setPosh) {
                        if (sum === '0' || sum === '' || sum === null || sum === undefined || sum === 0) {
                          setPosh('');
                        } else {
                          setPosh(human((Number(gosp||0)).toFixed(0)));
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
                      console.log('=== onKeyUpCapture: ', value);
                      setSum(value);
                      
                      const calc = calcPosh(value, courtType||'', benefitsSwitch, discount30Switch, discount50Switch);
                      const gosp = calc.gosp;
                      
                      console.log('=== courtType: ', courtType);
                      console.log('=== calc: ', calc);
                                      
                      const discount30: SetStateAction<number> = Number(calc.discount30);
                      const discount50: SetStateAction<number> = Number(calc.discount50);
                      
                      const exceed = Number(calc.exceed);
                      const fix = Number(calc.fix);
                      const percent = Number(calc.percent);
                      
                      setExceed(exceed);
                      setFix(fix);
                      setPercent(percent);
                        
                      if (courtType === 'arb') {
                        setDiscount50(discount50);
                      }

                      /*
                      let result = Number(gosp);
                      if (benefitsSwitch) {
                        result = Number(fixed2(gosp)) - calc.benefits;
                      }
                      if (discount30Switch) {
                        result = Number(gosp) - Number(discount30);
                      }
                      if (discount50Switch) {
                        result = Number(gosp) - Number(discount50);
                      }*/

                      let step: SetStateAction<number> = calc.step;
                      
                      if (setPosh) {
                        console.log('=== gosp: ', gosp);
                      
                        if (value === '0' || value === '' || value === null || value === undefined ) {
                          setPosh('');
                          setDiscount30(0);
                          setDiscount50(0);
                          setStep(0);
                        } else {
                          setPosh(human((Number(gosp||0)).toFixed(0)));
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
                      const data: copyToClipboardProps = {text: posh?.toString()||''};
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
                    disabled={!posh || Number(posh) <= 0 || posh === '0'}
                  >
                    <Copy />
                  </Button>
                  { LP.platform === 'android' || LP.platform === 'ios' ?
                    <Button
                      id='btnShare'
                      type='primary'
                      style={{
                        marginLeft: '8px',
                        height: '46px',
                        borderWidth: '2px',
                        width: '46px',
                        borderRadius: '16px',
                      }}
                      onClick={() => {
                        try {
                          console.log('mainButton.onCLick');
                          
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
                                  const url = 'https://t.me/GosPoshlinaDevBot/poshlina';
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
                      disabled={!posh || Number(posh) <= 0 || posh === '0'}
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
                    type='primary'
                    style={{
                      marginLeft: '8px',
                      height: '46px',
                      borderWidth: '2px',
                      width: '46px',
                      borderRadius: '16px',
                    }}
                    onClick={() => {
                      
                      MobDialog.show({
                        content: <QRCode_Styling/>, 
                        
                        closeOnAction: true,
                        actions: [
                          {
                            key: 'close',
                            text: 'Закрыть',
                            onClick: () => {
                              console.log('allgood');
                              console.log(blob);
                            },
                            style: {
                              fontSize: '14px',
                            }
                          }
                        ],
                        bodyStyle: {
                          backgroundColor: backgroundColor
                        }
                      })
                    }}
                    tabIndex={-1}
                    disabled={!posh || Number(posh) <= 0 || posh === '0'}
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

