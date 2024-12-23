const development = false;
const qrDebug = true;

import * as packageJson from '../../../package.json';
const version = packageJson.version;

import React, { useEffect, useState, type FC } from 'react';

import { QrCodeScan, Link45deg, Person, Briefcase, Check, Dot } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

import { Section, List, Banner } from '@telegram-apps/telegram-ui';
import { useLaunchParams, qrScanner, miniApp } from '@telegram-apps/sdk-react';
import { Button, Steps } from 'antd';
import { AutoCenter, Modal } from 'antd-mobile';

import { Link, StartAppInfo, AppFeatures } from '@/components/';

import { Code, getOrderedParams, link2code, Param, prepareHash } from '@/components/Calc/functions';

import { 
  accentTextColor,
  backgroundColor,
  buttonColor,
  hintColor,
  secondaryBgColor,
  sectionSeparatorColor,
  textColor } from '@/components/init';

import './IndexPage.css';
import { botMethod } from '@/api/bot/methods';
import { Step } from 'antd-mobile/es/components/steps/step';
import { PrimeReactProvider } from 'primereact/api';

const TCLR = import.meta.env.VITE_TXT_COLOR;

const AppHeader: FC = () => {
  const [code, setCode] = useState<Code>({} as Code);
  const [sum, setSum] = useState<string>('');
  const [link, setLink] = useState<string>('/');
  const [courtType, setCourtType] = useState<string>('');
  const navigate = useNavigate();

  const LP = useLaunchParams();
  const SP = LP.initData?.startParam;

  const isMobile = LP.platform === 'android' || LP.platform === 'ios';
  const qrIsAvailable = miniApp.isMounted() && miniApp.isSupported() && qrScanner.isSupported();

  const [bannerLinkHide, setBannerLinkHide] = useState<boolean>(() => {
    const storedBannerLinkState = sessionStorage.getItem('bannerLinkHide');
    return storedBannerLinkState ? storedBannerLinkState === 'true' : false;
  });

  console.log('%ccode: %o', `color: ${TCLR}`, code);

  let orderedParams: Param[] = [];
  const arr: string[] = SP?.split(/clc|bro/) ?? [];
  orderedParams = getOrderedParams(SP ?? '', arr) ?? [];

  useEffect(() => {
    sessionStorage.setItem('bannerLinkHide', bannerLinkHide.toString());
  }, [bannerLinkHide]);

  useEffect(() => {
    orderedParams.forEach((item) => {
      if (item.name === 'clc') {
        let _code = link2code(prepareHash(item.value)); 
        let _sum = '';
        setCode(_code);
        console.log('%cclc: %o', `color: ${TCLR}`, _code);
        
        if ( _code.sou !== '' ) {
          _sum = _code.sou;
          setCourtType('sou');
        } else if ( _code.arb !== '' ) {
          _sum = _code.arb;
          setCourtType('arb');
        }
        setLink('/starturl');
        setSum(_sum);
      }
    })
  },[])

  const subtitle = <>
    <div>Приложение открыто по ссылке с расчетом</div>
    <div>{courtType === 'sou' ? ' для суда общей юрисдикции' : courtType==='arb' && ' для арбитражного суда'}</div>
    <div>и с ценой иска: {sum} руб.</div>
  </>;

  return (
    <Section
      style={{ backgroundColor: secondaryBgColor }}
      //header={'Расчет государственной пошлины'}
      header={
        <header style={{
          color: accentTextColor,
          backgroundColor: secondaryBgColor,
          padding: '20px 24px 20px 22px'
        }}
      >
        <h1
          style={{
            fontSize: '18px',
            margin: '0px 0px 0px 0px',
            lineHeight: 'var(--tgui--subheadline2--line_height)',
            fontWeight: 'var(--tgui--font_weight--accent2)'}}
          >Расчёт государственной пошлины</h1>
      </header>}
      //footer={'Налоговый кодекс РФ предусматривает разные варианты расчетов в завсимости от вида суда'}
      footer={
        <footer style={{
          color: accentTextColor,
          backgroundColor: secondaryBgColor,
          padding: '20px 24px 4px 22px'
        }}>
          <h6
            style={{
              fontSize: '14px',
              margin: '0px',
              lineHeight: 'var(--tgui--subheadline2--line_height)',
              fontWeight: 'var(--tgui--font_weight--accent3)'
            }}
          >
            Налоговый кодекс РФ предусматривает разные варианты расчетов в зависимости от вида суда
          </h6>
        </footer>
      }
    >
      {
        (isMobile || qrDebug) && (qrIsAvailable || qrDebug) && <>
          <Banner
            className='banner'
            style={{
              backgroundColor: backgroundColor,
            }}
            before={<QrCodeScan size={30} style={{color: accentTextColor}}/>}
            header={<span style={{
              color: accentTextColor,
              fontWeight: 'var(--tgui--font_weight--accent3)'
            }}>QR-код с расчётом</span>}
            description='Отсканируйте QR-код с расчетом пошлины'
            onClick={async ()=> {
              if (!isMobile) {
                return;
              }
              if (qrScanner.open.isAvailable()) {
                qrScanner.isOpened(); // false
                const promise = qrScanner.open({
                  text: 'с расчетом пошлины',
                  onCaptured(qr: string) {
                    if (qr.includes('https://t.me/'+import.meta.env.VITE_BOT_NAME+'/'+import.meta.env.VITE_APP_NAME+'?startapp=')) {
                      console.log('qr: ', qr);
                      qrScanner.close();
                      sessionStorage.setItem('QRUrl', qr);
                      if (qr!=='') navigate('/qrurl');
                    } else {
                      qrScanner.close();
                      modal.show({
                        title: 'QR-код некорректен',
                        content: <AutoCenter><span style={{color: accentTextColor}}>Поищите другой код с расчётом.</span></AutoCenter>,
                        closeOnAction: true,
                        actions: [
                          {
                            key: 'good',
                            text: 'Хорошо',
                            primary: true,
                            style: {
                              height: '46px',
                              fontSize: '16px',
                              borderColor: buttonColor,
                              color: textColor,
                              backgroundColor: buttonColor
                              }
                            }
                          ],
                          bodyStyle: {
                            color: accentTextColor,
                            backgroundColor: backgroundColor
                          }
                        }
                      );
                    }
                  },
                });
                qrScanner.isOpened(); // true
                await promise;
                qrScanner.isOpened(); // false
              }
            }}
            tabIndex={-1}
          />            
        </>
      }
      {
        link !== '/' &&
        <>
          { !bannerLinkHide && 
          <Banner
            before={<Link45deg size={30} style={{color: accentTextColor}}/>}
            description={ subtitle }
            header={<span style={{
              color: accentTextColor,
              fontWeight: 'var(--tgui--font_weight--accent3)'
            }}>Расчет по ссылке</span>}
            className='banner'
            style={{
              backgroundColor: backgroundColor,
            }}
            onCloseIcon={() => setBannerLinkHide(true)}
            type="section"
          >
            <React.Fragment key=".0">
              <Link to={link}>
                <Button
                  type='primary'
                  style={{
                    height: '32px',
                    borderRadius: '8px'
                  }}
                >
                  Открыть
                </Button>
              </Link>
              <Button
                style={{
                  borderColor: accentTextColor,
                  backgroundColor: 'rgba(0, 0, 0, 0)',
                  color: accentTextColor,
                  height: '32px',
                  marginLeft: '8px'
                }}
                onClick={() => setBannerLinkHide(true)}
              >
                Скрыть
              </Button>
            </React.Fragment>
          </Banner>
          }
        </>
      }
    </Section>
  )
}

const modal = Modal;

const Footer = () => {
  return (
    <>
      <footer style={{
        color: accentTextColor,
        padding: '20px 24px 4px 22px'
      }}>
        <h6 style={{
          fontSize: '14px',
          margin: '0px 0px 0px 0px',
          lineHeight: 'var(--tgui--subheadline2--line_height)',
          fontWeight: 'var(--tgui--font_weight--accent3)'}}
        >
          <div>Расчёт размера государственной пошлины производится по новым правилам, начиная с 09.09.2024.</div>
        </h6>
      </footer>
    </>
  )
}

const CopyRight = () => {
  const ID = useLaunchParams().initData;

  const [userId] = useState<string>(ID?.user?.id.toString() || '');
  console.log('%cinitData: %o', `color: ${TCLR}`, ID);

  function handleClick() {
    const request = JSON.stringify({
      chat_id: import.meta.env.VITE_ADMIN_ID,
      text: `Пользователь ${ID?.user?.firstName} ${ID?.user?.lastName} (${ID?.user?.username}) нажал на id: ${ID?.user?.id}.`
    });
    
    botMethod(
      'sendMessage',
      request,
    ).then((data) => {
      console.log('%ccalcLoaded: %o', `color: ${TCLR}`, data);
    }).catch((error) => {
      console.log('%cerror: %o', `color: ${TCLR}`, error);
    });
  }

  return (
    <div style={{padding: '20px 24px 20px 24px', backgroundColor: secondaryBgColor, marginTop: '16px', fontSize: '12px'}}>
      <AutoCenter style={{margin: '4px 4px', color: hintColor}}>
        <Button
          size='small'
          style={{backgroundColor: secondaryBgColor, color: hintColor, fontSize: '10px'}}
          onClick={()=>handleClick()}
        >UId: {userId}</Button>
      </AutoCenter>
      <AutoCenter style={{margin: '4px 4px', color: hintColor}}><span>Калькулятор пошлины</span></AutoCenter>
      <AutoCenter style={{margin: '4px 4px', color: hintColor}}><span>Версия {version}</span></AutoCenter>
      <AutoCenter style={{margin: '4px 4px', color: hintColor}}><span>© 2024-2025</span></AutoCenter>
    </div>
  );
}

export const IndexPage: FC = () => {
  console.log('%cIndexPage: %o', `color: ${TCLR}`, window.location);
  console.log('%chistory: %o', `color: ${TCLR}`, history);
  return (
    <>
      <List>
        <AppHeader />  
        <Section
          footer={<Footer/>}
        >
          <Link to='/sou'>
            <Banner
              style={{
                borderTop: `1px solid ${sectionSeparatorColor}`,//var(--tg-theme-section-separator-color)`,
                backgroundColor: backgroundColor,
              }}
              before={<Person size={30} style={{color: accentTextColor}}/>}
              header={<span style={{
                color: accentTextColor,
                fontWeight: 'var(--tgui--font_weight--accent3)'
              }}>Общая юрисдикция и мировые суды</span>}
              className='banner'
              description='Статья 333.19 НК РФ'
            /> 
          </Link>
          <Link to='/arb'>
            <Banner
              before={<Briefcase size={30} style={{color: accentTextColor}}/>}
              header={<span style={{
                color: accentTextColor,
                fontWeight: 'var(--tgui--font_weight--accent3)'
              }}>Арбитражные суды</span>}
              className='banner'
              style={{
                backgroundColor: backgroundColor,
              }}
              description='Статья 333.21 НК РФ'
            />
          </Link>
        </Section>
        <Section
          footer={<CopyRight/>}
        >
          <Banner
            header={
              <span style={{
                color: accentTextColor,
                fontWeight: 'var(--tgui--font_weight--accent3)'
              }}>
                <PrimeReactProvider>
                  <Steps
                    direction='vertical'
                    /*style={{
                      '--title-font-size': '17px',
                      '--description-font-size': '15px',
                      '--indicator-margin-right': '12px',
                      '--icon-size': '22px',
                    } as React.CSSProperties}*/
                  >
                    <Step
                      title='Process'
                      status='process'
                      icon={<Check size={20}/>}
                    />
                    <Step
                      title='Process'
                      status='process'
                      icon={<Check size={20}/>}
                    />
                    <Step
                      title={<span style={{color: accentTextColor}}>Wait</span>}
                      status='wait'
                      icon={<Dot style={{color: accentTextColor}} size={20}/>}
                    />
                  </Steps>
                </PrimeReactProvider>
              </span>
            }
            className='banner'
            style={{
              backgroundColor: backgroundColor,
            }}
          />
          
        </Section>
        {development && <AppFeatures />}
        {development && <StartAppInfo />}
      </List>
    </>
  );
};

/*
  .ant-steps
  .ant-steps-item-process>.ant-steps-item-container>.ant-steps-item-tail::after {
    background-color: rgb(65 147 236);
}
*/


/*
<div
  class="tgui-a04b768cea14d789"
>
  <span
    class="tgui-c3e2e598bd70eee6
    tgui-080a44e6ac3f4d27
    tgui-809f1f8a3f64154d
    tgui-65c206f0fd891b6b
    tgui-2646957e5c9379f3"
  >
    <span
      style="
        color: rgb(106, 178, 242);
        font-weight: var(--tgui--font_weight--accent3);
      "
    >
      <div
        class="
          ant-steps ant-steps-vertical
          css-dev-only-do-not-override-1d3bjqn
        "
        style="
          --title-font-size: 17px;
          --description-font-size: 15px;
          --indicator-margin-right: 12px;
          --icon-size: 22px;
        "
      >
        <div class="ant-steps-item ant-steps-item-process ant-steps-item-custom ant-steps-item-active"><div class="ant-steps-item-container"><div class="ant-steps-item-tail"></div><div class="ant-steps-item-icon"><span class="ant-steps-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor" class="bi bi-check"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"></path></svg></span></div><div class="ant-steps-item-content"><div class="ant-steps-item-title">Process</div></div></div></div><div class="ant-steps-item ant-steps-item-process ant-steps-item-custom"><div class="ant-steps-item-container"><div class="ant-steps-item-tail"></div><div class="ant-steps-item-icon"><span class="ant-steps-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor" class="bi bi-check"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"></path></svg></span></div><div class="ant-steps-item-content"><div class="ant-steps-item-title">Process</div></div></div></div><div class="ant-steps-item ant-steps-item-wait ant-steps-item-custom"><div class="ant-steps-item-container"><div class="ant-steps-item-tail"></div><div class="ant-steps-item-icon"><span class="ant-steps-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor" class="bi bi-dot"><path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"></path></svg></span></div><div class="ant-steps-item-content"><div class="ant-steps-item-title">Wait</div></div></div></div></div></span></span></div>
*/