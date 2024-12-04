import { Section, Cell, List, Image, Banner, Button as TgButton} from '@telegram-apps/telegram-ui';
import { useEffect, useState, type FC } from 'react';

import { Link } from '@/components/Link/Link.tsx';
import './IndexPage.css';

import tonSvg from './ton.svg';

import { QrCodeScan, Link45deg, Person, Briefcase } from 'react-bootstrap-icons';
import { useLaunchParams, qrScanner, miniApp } from '@telegram-apps/sdk-react';
import { Code, getOrderedParams, link2code, Param, prepareHash } from '@/components/Calc/functions';

import { 
//  Popup as MobPopup, 
//  ConfigProvider as MobConfigProvider,
  AutoCenter,
  Button,
//  Button,
//  Button,
//  AutoCenter
} from 'antd-mobile';
import { /*backgroundColor,*/ accentTextColor, /*secondaryBgColor*/ } from '@/components/ConfigProvider/variables';
import React from 'react';

const txtColor = import.meta.env.VITE_TXT_COLOR;

const development = false;

const InitData: FC = () => {
  return (
    <Link to='/init-data'>
      <Cell subtitle='Пользовательские данные, информация о чате, технические данные'>Данные инициализации</Cell>
    </Link>
  );
}

const LaunchParams: FC = () => {
  return (
    <Link to='/launch-params'>
      <Cell subtitle='Идентификатор платформы, версия мини-приложения и т.д.'>Параметры запуска</Cell>
    </Link>
  );
}

const ThemeParams: FC = () => {
  return (
    <Link to='/theme-params'>
      <Cell subtitle='Информация о палитре приложений Telegram'>Параметры темы</Cell>
    </Link>
  );
}

const StartAppInfo: FC = () => {
  return (
    <Section
      header='Данные о запуске приложения'
      footer='Эти страницы помогают разработчикам узнать больше о текущей информации о запуске'
    >
      <InitData />
      <LaunchParams />
      <ThemeParams />
    </Section>
  );
}

const TonConnect: FC = () => {
  return (
    <Link to='/ton-connect'>
      <Cell
        before={<Image src={tonSvg} style={{ backgroundColor: '#5288C1' }}/>}
        subtitle='Подключите кошелек TON'
      >
        TON Connect
      </Cell>
    </Link>
  );
}

const AppFeatures: FC = () => {
  return (
    <Section
        header='Особенности'
        footer='Вы можете воспользоваться этими страницами, чтобы узнать больше о функциях, предоставляемых мини-приложениями Telegram и другими полезными проектами'
      >
        <TonConnect />
    </Section>
  );
}

const AppHeader: FC = () => {
  const [code, setCode] = useState<Code>({} as Code);
  const [sum, setSum] = useState<string>('');
  const [link, setLink] = useState<string>('/');
  const [courtType, setCourtType] = useState<string>('');
//  const [visiblePopup, setVisiblePopup] = useState(false);
  const [qrResult, setQrResult] = useState<string>('');
  const [bannerLinkHide, setBannerLinkHide] = useState<boolean>(() => {
    const storedBannerLinkState = sessionStorage.getItem('bannerLinkHide');
    return storedBannerLinkState ? storedBannerLinkState === 'true' : false;
  });

  const LP = useLaunchParams();
  const SP = LP.initData?.startParam;
  const isMobile = LP.platform === 'android' || LP.platform === 'ios';
  const qrIsAvailable = miniApp.isMounted() && miniApp.isSupported() && qrScanner.isSupported();

  console.log('%ccode: %o', `color: ${txtColor}`, code);

  //let link = '/';
  //let sum = '';
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
  
    /*
    if (code.sou !== '' ) {
      console.log('%ccode.sou: %o', `color: ${txtColor}`, code.sou);
      link = '/sou';
      //sum = code.sou;
      
    } else if (code.arb !== '' ) {
      console.log('%ccode.arb: %o', `color: ${txtColor}`, code.arb);
      link = '/arb';
      //sum = code.arb;
    }
    */
  },[])

  const subtitle = <>
    <div>Приложение открыто по ссылке с расчетом</div>
    <div>{courtType === 'sou' ? ' для суда общей юрисдикции' : courtType==='arb' && ' для арбитражного суда'}</div>
    <div>и с ценой иска: {sum} руб.</div>
  </>;

  return (
    <Section
      header={'Расчет государственной пошлины'}
      footer={'Налоговый кодекс РФ предусматривает разные варианты расчетов в завсимости от вида суда'}
    >
      {
        isMobile && qrIsAvailable && <>
          <div
            className='link'
            onClick={async ()=> {
              if (qrScanner.open.isAvailable()) {
                qrScanner.isOpened(); // false
                const promise = qrScanner.open({
                  text: 'с расчетом пошлины',
                  onCaptured(qr: string) {
                    if (qr.includes('https://t.me/'+import.meta.env.VITE_BOT_NAME+'/'+import.meta.env.VITE_APP_NAME+'?startapp=')) {
                      setQrResult(qr);
                      console.log('qr: ', qr);
                      qrScanner.close();
                    }
                  },
                });
                qrScanner.isOpened(); // true
                await promise;
                qrScanner.isOpened(); // false
              }
            }}
          >
            <Cell
              before={<QrCodeScan size={30}/>}
              subtitle='Отсканируйте QR-код с расчетом'
            >
              QR-код с расчётом
            </Cell>
            <AutoCenter>
              <div style={{color: accentTextColor}}>
                {qrResult}
              </div>
            </AutoCenter>
          </div>
        </>
      }
      {
        link !== '/' &&
        <>
          {/*<Link to={link}>
            <Cell
              before={<Link45deg size={30}/>}
              subtitle={ subtitle }
            >
              Расчет по ссылке
            </Cell>
          </Link>*/}
          {!bannerLinkHide && 
          <Banner
            before={<Link45deg size={30} style={{color: accentTextColor}}/>}
            description={ subtitle }
            header={<span style={{
              color: accentTextColor,
              fontWeight: 'var(--tgui--font_weight--accent3)'
            }}>Расчет по ссылке</span>}
            onCloseIcon={()=>{}}
            type="section"
          >
            <React.Fragment key=".0">
              <Link to={link}>
                <TgButton
                  size='s'
                  style={{
                    borderRadius: '16px'
                  }}
                >
                  Открыть
                </TgButton>
              </Link>
              <TgButton
                mode='plain'
                size='s'
                onClick={() => setBannerLinkHide(true)}
              >
                Скрыть
              </TgButton>
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
            <Cell
              before={<Person size={30}/>}
              subtitle='Статья 333.19 НК РФ'
            >
              Общая юрисдикция и мировые суды
            </Cell>
          </Link>
          <Link to='/arb'>
            <Cell
              before={<Briefcase size={30}/>}
              subtitle='Статья 333.21 НК РФ'
            >
              Арбитражные суды
            </Cell>
          </Link>
        </Section>
        {development && <AppFeatures />}
        {development && <StartAppInfo />}
      </List>
    </>
  );
};

