import {
  useEffect, useRef, useState,
  SetStateAction,
  type FC, type ReactNode
} from 'react';

import { init, miniApp, openTelegramLink, popup, shareURL, viewport, useSignal, useLaunchParams, themeParams } from '@telegram-apps/sdk-react';

import { PrimeReactProvider } from 'primereact/api';
import { InputNumber } from 'primereact/inputnumber'; // https://primereact.org/inputnumber/
import "primereact/resources/themes/lara-dark-blue/theme.css";
         
import { Typography, Button, List, Switch } from 'antd';

const { Title, Text } = Typography;

import { Copy, QrCode, Share, Trash, BoxArrowRight, ChatLeftDots } from 'react-bootstrap-icons';

import {
  Button as MobButton,
  CenterPopup as MobPopup,
  ConfigProvider as MobConfigProvider,
  AutoCenter as MobAutoCenter,
} from 'antd-mobile';

import ruRU from 'antd-mobile/es/locales/ru-RU'

import {
  accentTextColor,
  backgroundColor,
  hintColor,
  secondaryBgColor,
  sectionHeaderTextColor,
} from "../init";

import { Link } from '../Link/Link';

import './Calc.css';
import {
  calcPosh,
  Code,
  copyToClipboard,
  copyToClipboardProps,
  fixed2,
  human,
  sharelink
} from './functions';

import { stepArbText, stepSouText } from './constants';
import { QRCodeStyling } from '@liquid-js/qr-code-styling';
import { botMethod } from '@/api/bot/methods';

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
  const ID = LP.initData;
  const userid = ID?.user?.id.toString() || '';
  console.log('%cLaunchParams: %o', `color: ${txtColor}`, LP);

  console.log('%ccode: %o', `color: pink`, code);
  const startSum = code?.sou !=='' ? code?.sou.replace(/ /g,'') : code?.arb !=='' ? code?.arb.replace(/ /g,''):'';
  const startCalc = calcPosh(startSum||'', courtType||'obsh', code?.benefitsSwitch, code?.discount30Switch, code?.discount50Switch);

  console.log('%cstartCalc: %o', `color: ${txtColor}`, startCalc);
  const MA = miniApp;
  const TP = themeParams;
  console.log('%cminiApp: %o', `color: ${txtColor}`, MA);
  const VP = viewport;
  const PU = popup;

  if (!MA.isCssVarsBound()) MA.bindCssVars();
  if (!TP.isCssVarsBound()) TP.bindCssVars();

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

  const refCanvas = useRef<HTMLCanvasElement>(null);
  const refCanvasBW = useRef<HTMLCanvasElement>(null);

  const inputSumEl = useRef<InputNumber>(null);
  const buttonCopy = useRef<any>(null);
  const buttonShare = useRef<any>(null);
  const buttonQrCode = useRef<any>(null);

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupQRVisible, setPopupQRVisible] = useState(false);

  useEffect(() => {
    console.log('%cМини приложение ' + (MAisMounted ? 'смонтировано.' : 'размонтировано.'), MAisMounted ? 'color: lightgreen': 'color: #FFC0CB'); 
    console.log('%cОбласть просмотра ' + (VPisMounted ? 'смонтирована.' : 'размонтирована.'), VPisMounted ? 'color: lightgreen': 'color: #FFC0CB'); 
    console.log('%cВсплывающее окно ' + (PUisOpened ? 'открыто.' : 'закрыто.'), PUisOpened ? 'color: lightgreen': 'color: #FFC0CB');
  }, [
    MAisMounted,
    VPisMounted,
    PUisOpened,
  ]);

  //init(); console.log('%cinit()',`color: ${txtColor}`);
  //MA.mount(); console.log('%cminiApp.mount(): %o', `color: ${txtColor}`, MA.isMounted());
  console.log('%cminiApp: %o', `color: ${txtColor}`, MA);

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
  },[benefitsSwitch, discount30Switch, discount50Switch, sum]);
  
  const mockContentWithCloseIcon = (
    <>
      <div style={{ padding: '40px 20px 20px' }}><MobAutoCenter>Сумма пошлины: {human(posh)} руб.</MobAutoCenter></div>
      <MobAutoCenter>
        <Button
          onClick={()=>setPopupVisible(false)}
        >
          Хорошо
        </Button>
      </MobAutoCenter>
    </>
  )

  const MockContentWithQRCode = () => {
    const sou = courtType === 'obsh' ? human(sum) : '';
    const arb = courtType === 'arb' ? human(sum) : '';
    const url = sharelink(sou, arb, benefitsSwitch, discount30Switch, discount50Switch, userid); 
    console.log('url: ',url);
    
    return (
      <>
        <div style={{ padding: '40px 20px 10px' }}>
          <QRCode_Styling text={url}/>
        </div>
      </>
      )
  }
    
  /*
  async function downloadImage(
    imageSrc: string,
    nameOfDownload = 'my-image.png',
  ) {
    const response = await fetch(imageSrc);
  
    const blobImage = await response.blob();
  
    const href = URL.createObjectURL(blobImage);
  
    const anchorElement = document.createElement('a');
    anchorElement.href = href;
    anchorElement.download = nameOfDownload;
  
    document.body.appendChild(anchorElement);
    anchorElement.click();
  
    document.body.removeChild(anchorElement);
    window.URL.revokeObjectURL(href);
  }
  */

  
  /**
   * Перенести в файл с функциями!!! Не работает из Telegram
   * @param blob 
   * @param nameOfDownload 
   */
  /*
  function downloadBlob(blob: Blob, nameOfDownload = 'qrcode.png') {
    const url = URL.createObjectURL(blob);
    
    const anchorElement = document.createElement('a');
    anchorElement.href = url;
    anchorElement.download = nameOfDownload;

    document.body.appendChild(anchorElement);
    anchorElement.click();

    document.body.removeChild(anchorElement);
    window.URL.revokeObjectURL(url);
  }*/

  function QRCode_Styling({text}: {text: string}) {
    const cardFront = 'Чёрное на белом';
    const cardBack = 'Белое на чёрном';
    const [isFlipped, setFlipped] = useState(false);
  
    const handleFlip = () => {
        setFlipped(!isFlipped);
    };
  
    const qrCodeWB = new QRCodeStyling({
      data: text,
      //image: "https://casebookkiller.github.io/poshlina-dev/Logo.svg",
      shape: 'square',
      dotsOptions: {
        color: 'white',
        type: 'random-dot',
        size: 18,
      },
      cornersSquareOptions: {
        color: 'white',
        type: 'extra-rounded'
      },
      cornersDotOptions: {
        color: 'white',
        type: 'extra-rounded'
      },
      backgroundOptions: {
        color: 'black',//'rgba(0,0,0,0)',//backgroundColor,
        margin: 1
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 1,
        imageSize: 0.5
      }
    });

    const qrCodeBW = new QRCodeStyling({
      data: text,
      //image: "https://casebookkiller.github.io/poshlina-dev/Logo.svg",
      shape: "square",
      dotsOptions: {
        color: 'black',
        type: "random-dot",
        size: 18,
      },
      cornersSquareOptions: {
        color: 'black',
        type: "extra-rounded"
      },
      cornersDotOptions: {
        color: 'black',
        type: "extra-rounded"
      },
      backgroundOptions: {
        color: 'white',
        margin: 1
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 1,
        imageSize: 0.5
      }
    });
  
    useEffect(() => {
      console.log('%cQRCode: %o', `color: ${txtColor}`, qrCodeWB);
      console.log('%cQRCodeBW: %o', `color: ${txtColor}`, qrCodeBW);
     
      function getSize(qrCode: QRCodeStyling) {
        return {width: qrCode.size?.width, height: qrCode.size?.height};
      }
  
      const size = getSize(qrCodeWB);
      console.log(size);

      const sizebw = getSize(qrCodeBW);
      console.log(sizebw);
      
      // белое на чёрном 
      qrCodeWB.serialize().then((code) => {
        if (code !== undefined) {
          let dataURL = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(code);
          
          let canvas: HTMLCanvasElement = document.getElementById('canvaswb') as HTMLCanvasElement;
          
          canvas.width = size.width || 0;
          canvas.height = size.height || 0;
          
          let ctx:any;
          if (canvas?.getContext) {
            ctx = canvas.getContext('2d');
          } else {
            console.error('Canvas element not found');
          }
  
          let _img = new Image();
          _img.width = 1024;
          _img.height = 1024;
          
          _img.addEventListener('load', e => {
            ctx.drawImage(e.target, 0, 0);

            canvas.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                console.log(url);
              }
            })
          });
  
          _img.src = dataURL;
        }
      });

      //qrCodeWB.append(document.getElementById('canvaswb') as HTMLCanvasElement);
      // черное на белом
      qrCodeBW.serialize().then((code) => {
        if (code !== undefined) {
          let dataURL = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(code);
          let canvasbw: HTMLCanvasElement = document.getElementById('canvasbw') as HTMLCanvasElement;
          
          canvasbw.width = size.width || 0;
          canvasbw.height = size.height || 0;
          
          let ctx:any;
          if (canvasbw?.getContext) {
            ctx = canvasbw.getContext('2d');
          } else {
            console.error('Canvas element not found');
          }
  
          let _img = new Image();
          _img.width = 1024;
          _img.height = 1024; 
  
          _img.addEventListener('load', e => {
            ctx.drawImage(e.target, 0, 0);

            canvasbw.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                console.log(url);
              }
            })
          });
  
          _img.src = dataURL;
        }
      });
    }, []);
    
    return (
      <>
      <PrimeReactProvider value={{unstyled: false}}>
        <MobConfigProvider locale={ruRU}>
          <div className="App" style={{
            display: 'flex',
            justifyContent: 'center',
            minHeight:'370px',
            width:'auto',
            overflowY: 'hidden',
          }}>
            <div className="QRFlip">
              <h4 style={{color: accentTextColor, margin: '0px 0px 10px 0px'}}>Нажми для изменения цвета</h4>
              <div className="container">
                <div
                  className={`flip-card ${
                    isFlipped ? "flipped" : ""
                  }`}
                >
                  <div className="flip-card-inner">
                    <div className="flip-card-front">
                      <div
                        className="card-content"
                        onClick={handleFlip}
                      >
                        {cardFront}
                        <div className='placeholder'>
                          <canvas ref={refCanvasBW} className="square" id='canvasbw' style={{
                            display:'block',
                            padding: 0,
                            maxWidth: '234px',
                            maxHeight: '234px',
                          }}/>
                        </div>
                      </div>
                    </div>

                    <div className='flip-card-back'>
                      <div
                        className='card-content'
                        onClick={handleFlip}
                      >
                        {cardBack}
                        <div className='placeholder'>
                          <canvas
                            ref={refCanvas}
                            className='square'
                            id='canvaswb'
                            style={{
                              display:'block',
                              padding: 0,
                              maxWidth: '234px',
                              maxHeight: '234px',
                            }}
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
                <MobAutoCenter style={{margin: '20px 0px 0px 0px', width: '100%'}}>
                  <PrimeReactFlex>
                    <MobButton
                      id='btnSendToChat'
                      style={{ width: '100%', height: '34px', fontSize: '12px'}}
                      onClick={() => {
                        let canvas: HTMLCanvasElement;
                        if (isFlipped) {
                          canvas = document.getElementById('canvaswb') as HTMLCanvasElement;
                        } else {
                          canvas = document.getElementById('canvasbw') as HTMLCanvasElement;
                        }
                        
                        canvas.toBlob((blob) => {
                          if (blob) {
                            const sou = courtType === 'obsh' ? human(sum) : '';
                            const arb = courtType === 'arb' ? human(sum) : '';
                            const url = sharelink(sou, arb, benefitsSwitch, discount30Switch, discount50Switch, userid); 
                      
                            const caption = posh ? `<b>При обращении в ${courtType === 'obsh' ? 'суд общей юрисдикции' : 'арбитражный суд'}</b>\n\nс ценой иска: <b>${human(sum)} руб.</b>\n\nРазмер пошлины составляет:\n\n<b>${human(posh)} руб.</b>\n\n<a href='${url}'>Открыть расчёт</a>`: '';
                            
                            let formData = new FormData();
                            formData.append('chat_id', ID?.user?.id.toString() || '');
                            formData.append('parse_mode', 'html');
                            formData.append('caption', caption);
                            //formData.append('caption_entities', JSON.stringify([]));
                            formData.append('photo', blob, 'qr.png');
                            botMethod(
                              'sendPhoto',
                              formData
                            ).then((result) => {
                              console.log(result);
                              setPopupQRVisible(false);
                              if (openTelegramLink.isAvailable()) {
                                openTelegramLink('https://t.me/'+import.meta.env.VITE_BOT_NAME);
                              }
                            }).catch((error) => {
                              console.log(error);
                            })
                            //downloadBlob(blob);
                            //copyToClipboard(data);
                          }
                        });

                      }}
                    >
                      <div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
                        <ChatLeftDots/>
                        <span style={{marginLeft:'5px', fontWeight: 'normal'}}>Сохранить в чат</span>
                      </div>
                    </MobButton>
                    <MobButton
                      style={{
                        height: '34px',
                        fontSize: '12px',
                        backgroundColor: backgroundColor,
                        color: hintColor,
                        alignItems: 'center',
                        borderColor: hintColor
                      }}
                      onClick={() => {
                        setPopupQRVisible(false);
                      }}
                    >
                      <div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
                        <BoxArrowRight/>
                        <span style={{marginLeft:'5px', fontWeight: 'normal'}}>Закрыть</span>
                      </div>
                    </MobButton>
                  </PrimeReactFlex>
                </MobAutoCenter>
              </div>
            </div>
          </div>
          </MobConfigProvider>
        </PrimeReactProvider>
      </>
    );
  }
 
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
                title={<Text style={{color: accentTextColor}}>Льгота {courtType === 'obsh' ? '-25 000': '-55 000'} р.</Text>}
                description={
                courtType === 'obsh' ?
                <>
                  <Text style={{color: hintColor}} className='unselectable'>
                    <Link
                      to='/nk333_36#p2s333_36'
                      tabIndex={-1}
                    >
                      Льготные категории
                    </Link> плательщиков определены п.2, п.3 ст.333.36 НК РФ.
                  </Text>
                </>
                :
                <>
                  <Text style={{color: hintColor}} className='unselectable'>
                    <Link
                      to='/nk333_37#p2s333_37'
                      tabIndex={-1}
                    >
                      Льготные категории
                    </Link> плательщиков определены п.2, п.3 ст.333.37 НК РФ.
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
                    title={<Text style={{color: accentTextColor}}>Скидка в 30%</Text>}
                    description={
                      <>
                        <Text style={{color: hintColor}} className='unselectable'>
                          <Link
                            to='/nk333_19#pp10p1s333_19'
                            tabIndex={-1}
                          >
                            Ситуации
                          </Link> для применения скидки в 30% определены пп.10 п.1 ст.333.19 НК РФ.
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
                    title={<Text style={{color: accentTextColor}}>Скидка в 30%</Text>}
                    description={
                      <>
                        <Text style={{color: hintColor}} className='unselectable'>
                          <Link
                            to='/nk333_21#pp13p1s333_21'
                            tabIndex={-1}
                          >
                            Ситуации
                          </Link> для применения скидки в 30% определены пп.13 п.1 ст.333.21 НК РФ.
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
                    title={<Text style={{color: accentTextColor}}>Скидка в 50%</Text>}
                    description={
                      <>
                        <Text style={{color: hintColor}} className='unselectable'>
                          <Link
                            to='/nk333_21#pp9p1s333_21'
                            tabIndex={-1}
                          >
                            Ситуации
                          </Link> для применения скидки в 50% определены пп.9 п.1 ст.333.21 НК РФ.
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
                title={<Text style={{color: accentTextColor}}>Расчёт пошлины</Text>}
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
                      style={{color: accentTextColor}}
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
                      
                      const msg = posh ? `Сумма пошлины в ${courtType === 'obsh' ? 'суд общей юрисдикции' : 'арбитражный суд'} от цены иска ${human(sum)} руб. составляет: ${posh} руб.\nРасчёт по ссылке: ${url}`: '';

                      //Сумма пошлины: 64 311 руб.,
                      //расчет: https://t.me/tgfee_bot/app?startapp=clcg5758755hbro99281932
                      
                      const data: copyToClipboardProps = {text: msg};
                      copyToClipboard(data);
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
                        const sou = courtType === 'obsh' ? human(sum) : '';
                        const arb = courtType === 'arb' ? human(sum) : '';
                        const url = sharelink(sou, arb, benefitsSwitch, discount30Switch, discount50Switch, userid); 
                        try {
                          console.log('%cmainButton.onCLick',`color: ${txtColor}`);
                          
                          if (PU.isSupported()) {
                          
                            PU.open({
                              title: 'Поделиться расчетом!',
                              message: 'Для того чтобы поделиться расчетом, нажмите на кнопку Хорошо.',
                              buttons: [
                                { id: 'btnproceed', type: 'default', text: 'Хорошо' },
                                { id: 'btncancel', type: 'cancel' },
                              ],
                            }).then((buttonId: string|null) => {
                              if (buttonId === 'btnproceed') {
                                console.log(url);
                                const msg = `Сумма пошлины в ${courtType === 'obsh' ? 'суд общей юрисдикции' : 'арбитражный суд'} от цены иска ${human(sum)} руб. составляет: ${posh} руб.\nРасчёт по ссылке: ${url}`;
                                shareURL(msg);
                              } else {
                                console.log(
                                  buttonId === null 
                                    ? 'Пользователь не нажимал кнопок.'
                                    : `Пользователь нажал кнопку с ID "${buttonId}"`
                                );
                              }}).catch((error: unknown)=>{
                                if (error instanceof Error) {
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
                    >
                      <Share />
                    </Button>:<></>
                  }
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
                      
                      setPopupQRVisible(true);
                    }}
                    tabIndex={-1}
                  >
                    <QrCode />
                  </Button>
                
                </PrimeReactFlex>
              
            </List.Item>
          </List>
          <MobPopup
            key={'mobPopupQRCode'}
            visible={popupQRVisible}
            onMaskClick={() => setPopupQRVisible(false)}
            onClose={() => setPopupQRVisible(false)}
            bodyStyle={{
              width: '100%',
              backgroundColor: backgroundColor
            }}
            showCloseButton={true}
          >
            <MockContentWithQRCode/>
          </MobPopup>
          <MobPopup
            key={'mobPopup'}
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