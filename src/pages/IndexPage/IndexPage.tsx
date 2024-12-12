const development = false;

import * as packageJson from '../../../package.json';
const version = packageJson.version;

import React, { useEffect, useState, type FC } from 'react';
import { QrCodeScan, Link45deg, Person, Briefcase } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

import { Section, List, Banner } from '@telegram-apps/telegram-ui';
import { useLaunchParams, qrScanner, miniApp,
  //themeParams
} from '@telegram-apps/sdk-react';
import { Button } from 'antd';
import { AutoCenter, Modal } from 'antd-mobile';

import { Link, StartAppInfo, AppFeatures,
  //DisplayData
} from '@/components/';

import { Code, getOrderedParams, link2code, Param, prepareHash } from '@/components/Calc/functions';

import { 
  accentTextColor,
  backgroundColor,
  buttonColor,
  headerBgColor,
  hintColor,
  secondaryBgColor,
  textColor } from '@/components/init';

import './IndexPage.css';
import { botMethod } from '@/api/bot/methods';

const TCLR = import.meta.env.VITE_TXT_COLOR;

const AppHeader: FC = () => {
  const [code, setCode] = useState<Code>({} as Code);
  const [sum, setSum] = useState<string>('');
  const [link, setLink] = useState<string>('/');
  const [courtType, setCourtType] = useState<string>('');
  const navigate = useNavigate();

  const LP = useLaunchParams();
  const SP = LP.initData?.startParam;

  //const [userId] = useState<string>(LP.initData?.user?.id.toString() || '');
  //console.log('%cinitData: %o', `color: ${TCLR}`, LP.initData);

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
      //header={'Расчет государственной пошлины'}
      header={<header style={{
      color: accentTextColor,
      backgroundColor: secondaryBgColor,
      padding: '20px 24px 20px 22px'
      }}>
        <h1
          style={{
            fontSize: '18px',
            margin: '0px 0px 0px 0px',
            lineHeight: 'var(--tgui--subheadline2--line_height)',
            fontWeight: 'var(--tgui--font_weight--accent2)'}}
          >Расчёт государственной пошлины</h1>
      </header>}
      footer={'Налоговый кодекс РФ предусматривает разные варианты расчетов в завсимости от вида суда'}
    >
      {
        isMobile && qrIsAvailable && <>
          <Banner
            className='banner'
            before={<QrCodeScan size={30} style={{color: accentTextColor}}/>}
            header={<span style={{
              color: accentTextColor,
              backgroundColor: headerBgColor,
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
  const ID = useLaunchParams().initData;

  const [userId] = useState<string>(ID?.user?.id.toString() || '');
  console.log('%cinitData: %o', `color: ${TCLR}`, ID);

  function handleClick() {
    //https://api.telegram.org/bot${tg.token}/sendMessage?chat_id=${tg.chat_id}&text=${text}`
    /*{
      "status": "done",
      "payload": {
        "ok": true,
        "result": {
          "message_id": 24,
          "from": {
            "id": 7989859769,
            "is_bot": true,
            "first_name": "Калькулятор пошлины",
            "username": "tgfee_bot"
          },
          "chat": {
            "id": 275342303,
            "first_name": "Алексей",
            "last_name": "Кузнецов",
            "username": "kuznetsov_proff",
            "type": "private"
          },
          "date": 1733826984,
          "text": "Калькулятор пошлины загружен."
        }
      }
    }*/

    const request = JSON.stringify({
      chat_id: ID?.user?.id,
      text: `Пользователь ${ID?.user?.firstName} ${ID?.user?.lastName} (${ID?.user?.username}) нажал на id: ${ID?.user?.id}.`
    });

    /*
    fetchBot(
      'sendMessage',
      request,
      (data) => {
        console.log('%ccalcLoaded: %o', `color: ${TCLR}`, data);
      },
      (error) => {
        console.log('%cerror: %o', `color: ${TCLR}`, error);
      }
    );*/
    
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
      <div style={{padding: '20px 24px 20px 24px', backgroundColor: backgroundColor, marginTop: '16px', fontSize: '12px'}}>
        <AutoCenter style={{margin: '4px 4px', color: hintColor}}>
          <Button
            size='small'
            style={{color: hintColor, fontSize: '10px'}}
            onClick={()=>handleClick()}
          >UId: {userId}</Button>
        </AutoCenter>
        <AutoCenter style={{margin: '4px 4px', color: hintColor}}><span>Калькулятор пошлины</span></AutoCenter>
        <AutoCenter style={{margin: '4px 4px', color: hintColor}}><span>Версия {version}</span></AutoCenter>
        <AutoCenter style={{margin: '4px 4px', color: hintColor}}><span>© 2024-2025</span></AutoCenter>
        {/*<List>
          <DisplayData
            rows={
              Object
                .entries(themeParams.state())
                .map(([title, value]) => ({
                  title: title
                    .replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`)
                    .replace(/background/, 'bg'),
                  value,
                }))
            }
          />
        </List>*/}
      </div>
    </>
  )
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
              before={<Person size={30}/>}
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
              before={<Briefcase size={30}/>}
              header={<span style={{
                color: accentTextColor,
                fontWeight: 'var(--tgui--font_weight--accent3)'
              }}>Арбитражные суды</span>}
              className='banner'
              description='Статья 333.21 НК РФ'
            />
          </Link>
        </Section>
        {development && <AppFeatures />}
        {development && <StartAppInfo />}
      </List>
    </>
  );
};