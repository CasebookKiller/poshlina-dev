
const development = false;

import * as packageJson from '../../../package.json';
const version = packageJson.version;

import React, { useEffect, useState, type FC } from 'react';
import { QrCodeScan, Link45deg, Person, Briefcase } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

import { Section, List, Banner } from '@telegram-apps/telegram-ui';
import { useLaunchParams, qrScanner, miniApp } from '@telegram-apps/sdk-react';
import { Button } from 'antd';

import { Link, StartAppInfo, AppFeatures } from '@/components/';

import { Code, getOrderedParams, link2code, Param, prepareHash } from '@/components/Calc/functions';

import { accentTextColor, hintColor } from '@/components/ConfigProvider/variables';

import './IndexPage.css';

const txtColor = import.meta.env.VITE_TXT_COLOR;

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

  console.log('%ccode: %o', `color: ${txtColor}`, code);

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
        console.log('%cclc: %o', `color: ${txtColor}`, _code);
        
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
      padding: '20px 24px 14px 22px'
      }}>
        <h1
          style={{
            fontSize: '16px',
            margin: '0px 0px 0px 0px',
            lineHeight: 'var(--tgui--subheadline2--line_height)',
            fontWeight: 'var(--tgui--font_weight--accent2)'}}
          >Расчет государственной пошлины</h1><div style={{color: hintColor}}>Версия {version}</div>
      </header>}
      footer={'Налоговый кодекс РФ предусматривает разные варианты расчетов в завсимости от вида суда'}
    >
      {
        isMobile && qrIsAvailable && <>
          <Banner
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
                      //setQrResult(qr);
                      console.log('qr: ', qr);
                      qrScanner.close();
                      sessionStorage.setItem('QRUrl', qr);
                      if (qr!=='') navigate('/qrurl');
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

export const IndexPage: FC = () => {
  console.log('%cIndexPage: %o', `color: ${txtColor}`, window.location);
  console.log('%chistory: %o', `color: ${txtColor}`, history);
  return (
    <>
      <List>
        <AppHeader />  
        <Section
          footer='Расчёт размера государственной пошлины производится по новым правилам, начиная с 09.09.2024.'
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