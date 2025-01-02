/**
 * Настройки режима отладки
 */
const development = false;
const qrDebug = false;
const socialDebug = true;
const idsDebug = false;

/**
 * Код версии
 */
import * as packageJson from '../../../package.json';
const version = packageJson.version;

import React, { createContext, ReactNode, useContext, useEffect, useRef, useState, type FC } from 'react';

import { QrCodeScan, Link45deg, Person, Briefcase, ChevronRight, Check2, Share, ExclamationLg as Exclamation } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

import { Section, List, Banner } from '@telegram-apps/telegram-ui';
import { useLaunchParams, qrScanner, miniApp, openTelegramLink, shareURL } from '@telegram-apps/sdk-react';
import { Button } from 'antd';
import { AutoCenter, Modal, Button as MobButton, ButtonRef } from 'antd-mobile';

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
import { PrimeReactProvider } from 'primereact/api';
import { Timeline } from 'primereact/timeline';
import { ProgressSpinner } from 'primereact/progressspinner';
import { PrimeReactFlex } from '@/components/Calc/Calc';

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
    });
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

interface AppTask {
  id: number;
  title: string;
  description?: string;
  marker?: ReactNode;
  status?: string;
  after?: string;
  cb?: () => string;
}

/*
setPerson({
  ...person, // Copy the old fields
  firstName: e.target.value // But override this one
});
*/

import Supabase from '../../supabaseClient';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
const SBaseContext = createContext(Supabase);

interface TGID {
  created_at: string; id: number; tgbro: string | null; tgid: string;
}
export const IndexPage: FC = () => {
  const SBase = useContext(SBaseContext); 
  
  const [ids, setIds] = useState<TGID[]>();
  
  const LP = useLaunchParams();
  const ID = LP.initData;
  const SP = ID?.startParam;
  const refs = useRef<ButtonRef[]>([]);
  
  const DefaultMarker = <div className="p-timeline-event-marker" data-pc-section="marker"/>;
  const DisabledMarker = <div className="p-timeline-event-marker-disabled" data-pc-section="marker"/>;

  const [tasks, setTasks] = useState<AppTask[]>([
    /*{
      id: 1,
      title: 'TON Wallet',
      status: 'active', // disabled
      after: 'waiting', // 'waiting', 'success', 'error', 'checking', 'share'
      cb: () => {
        console.log('%cTON Wallet', `color: pink`);
        return 'error';
      }
    },*/
    {
      id: 2,
      title: 'Подписаться на новости',
      marker: DefaultMarker,
      status: 'active',
      after: 'waiting',
      cb: () => {
        console.log('%ccasebook{killer} channel', `color: pink`);
        let formData = new FormData();
        formData.append('chat_id', '-1002212964660');
        formData.append('user_id', ID?.user?.id.toString() || '');
        botMethod(
          'getChatMember',
          formData
        ).then((result: any) => {
          console.log(result);
          console.log(result.payload?.result?.status);
          if (result.payload?.result?.status === 'member') {
            setAfter(2, 'success');
            setDisabled(2);
            setMarker(2,'disabled');
          } else {
            setActive(2);
            setAfter(2, 'waiting');
            setMarker(2,'active');
            if (openTelegramLink.isAvailable()) {
              openTelegramLink('https://t.me/'+import.meta.env.VITE_CHANNEL_NAME);
            }
          }
        }).catch((error) => {
          console.log(error);
          setAfter(2, 'error');
        })
        return 'checking';
      }
    },
    {
      id: 3,
      title: 'Поделиться',
      marker: DefaultMarker,
      status: 'active',
      after: 'share',
      cb: () => {
        const applink = 'https://t.me/' + import.meta.env.VITE_BOT_NAME + '/' + import.meta.env.VITE_APP_NAME + '?startapp=';
        const userid = ID?.user?.id.toString() || '';
        const bro = userid != '' ? 'bro' + userid : '';
        const url = applink + bro;
        const msg = `Приложение для расчета пошлины при обращении в арбитражные суды и суды общей юрисдикции: ${url}`;
        shareURL(msg);
        return 'share';
      }
    }
  ]);
  
  async function getIds() {
    const result: PostgrestSingleResponse<TGID[]> = await SBase.from("ids").select();
    console.log('%cids: %o', `color: firebrick; background-color: white`, result.data);  
    setIds(result.data||[]);
  }

  async function checkTGId(tgid: string) {
    const result: PostgrestSingleResponse<TGID[]> = await SBase.from("ids").select().eq('tgid', tgid);
    console.log('%cid: %o', `color: firebrick; background-color: white`, result.data);  
    return result.data;
  }

  async function addTGId(tgid: string) {
    const result = await SBase
      .from('ids')
      .insert([
        { tgid: tgid },
      ])
      .select();
      console.log('%cid: %o', `color: firebrick; background-color: white`, result.status);
    return result.data;
  }
  async function addTGIdWithBro(tgid: string, tgbro: string) {
    const result = await SBase
      .from('ids')
      .insert([
        { tgid: tgid, tgbro: tgbro },
      ])
      .select();
      console.log('%cid: %o', `color: firebrick; background-color: white`, result.status);
    return result.data;
  }

  useEffect(() => {
    let bro: string = '';
    const orderedParams: Param[] = getOrderedParams(SP ?? '', SP?.split(/clc|bro/) ?? []) ?? [];
    orderedParams.forEach((item) => {
      if (item.name === 'bro') bro = item.value;
    });

    updateTasks();
    getIds();
    console.log('%cID: %o', `color: lightgreen`, ID);
    if (ID?.user?.id) {
      checkTGId(ID?.user?.id.toString()).then((result) => {
        if (result?.length) {
          console.log('%cid: %o', `color: yellow`, result);  
        } else {
          if (bro !== '') {
            addTGIdWithBro(ID?.user?.id.toString() || '', bro || '').then((result) => {
              console.log('%cid: %o', `color: yellow`, result);  
            });
          } else {
            console.log('%cid: %o', `color: yellow`, 'no bro');
            addTGId(ID?.user?.id.toString() || '').then((result) => {
              console.log('%cid: %o', `color: yellow`, result);  
            });
          }
        }
      });
      
    }

    
    
  }, []);

  function updateTasks() {
    setTasks((tasks) => {
      return tasks.map((task) => {
        return {...task, after: checkTask(task)};
      });
    });
  }

  function checkTask(task: AppTask) {
    console.log('%cid: %o', `color: ${TCLR}`, task.id);
    const status = task.cb ? task.cb(): 'waiting';
    
    return status; //'waiting', 'success', 'error', 'checking'
  }

  function setActive(id: number) {
    setTasks((tasks) => tasks.map((task) => task.id === id ? {...task, status: 'active'} : task));
  }

  function setMarker(id: number, status: string) {
    if (status === 'active') setTasks((tasks) => tasks.map((task) => task.id === id ? {...task, marker: DefaultMarker} : task));
    if (status === 'disabled') setTasks((tasks) => tasks.map((task) => task.id === id ? {...task, marker: DisabledMarker} : task));
  }

  function setDisabled(id: number) {
    setTasks((tasks) => tasks.map((task) => task.id === id ? {...task, status: 'disabled'} : task));
  }

  function setAfter(id: number, after: string) {
    setTasks((tasks) => tasks.map((task) => task.id === id ? {...task, after} : task));
  }

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
          {socialDebug && 
          <Banner
            header={
              <span style={{
                color: accentTextColor,
                fontWeight: 'var(--tgui--font_weight--accent3)'
              }}>
                <PrimeReactProvider>
                  <Timeline align={'left'} value={tasks} marker={(item) => item.marker} content={(item) => {
                    console.log('%citem: %o', `color: ${TCLR}`, item);
                    return (
                      <MobButton
                        ref={el=>refs.current[item.id]=el!}
                        color={item.status === 'active' ? 'default' : 'primary'}  
                        onClick={() => {
                          console.log('%citem: %o', `color: ${TCLR}`, item);
                          //setTasks(tasks.map((task) => {
                          //  return {...task, after: checkTask(task.id)};
                          //}));
                    
                          setTasks(tasks.map((task) => {
                            if (task.id === item.id) {
                              //if (task.cb) task.cb();
                              return {
                                ...task,
                                after: 'checking'
                              };
                            }
                            return task;
                          }));
                          console.log('%citem.id: %o','color: yellow', item.id);
                          setTasks(tasks.map((task) => {
                            if (task.id === item.id) {
                              //if (task.cb) task.cb();
                              return {...task, after: checkTask(task)};
                            }
                            return task;
                          }));
                        }}
                        fill={'outline'}
                        style={{width: '100%'}}
                        disabled={item.status === 'disabled'}
                      >
                        <PrimeReactFlex>
                          <div style={{width: '80%', textAlign: 'left'}}>{item.title}</div>
                          <div style={{width: '20%', textAlign: 'right'}}>
                            {item.after === 'waiting' && <ChevronRight style={{position: 'relative', marginLeft: '0.5rem', top: '0.2rem', width: '1rem', height: '1rem', stroke: 'var(--tg-theme-accent-text-color)'}} strokeWidth="2" fill="var(--tg-theme-accent-text-color)"/>}
                            {item.after === 'checking' && <ProgressSpinner style={{marginLeft: '0.5rem', top: '0.2rem', width: '1rem', height: '1rem'}} strokeWidth="4" fill="var(--surface-ground)" animationDuration=".5s"/>}
                            {item.after === 'success' && <Check2 style={{position: 'relative', marginLeft: '0.5rem', top: '0.2rem', width: '1rem', height: '1rem', stroke: 'var(--tg-theme-hint-color)'}} strokeWidth="2" fill="var(--tg-theme-accent-text-color)"/>}
                            {item.after === 'error' && <Exclamation style={{position: 'relative', marginLeft: '0.5rem', top: '0.2rem', width: '1rem', height: '1rem', stroke: 'var(--tg-theme-destructive-text-color)'}} strokeWidth="1"/>}
                            {item.after === 'share' && <Share style={{position: 'relative', marginLeft: '0.5rem', top: '0.2rem', width: '1rem', height: '1rem', stroke: 'var(--tg-theme-accent-text-color)'}} strokeWidth="1"/>}
                          </div>
                        </PrimeReactFlex>
                      </MobButton>
                    );
                  }}>

                  </Timeline>
                </PrimeReactProvider>
              </span>
            }
            className='banner'
            style={{
              backgroundColor: backgroundColor,
            }}
          />}
          
        </Section>
        {development && <AppFeatures />}
        {development && <StartAppInfo />}
      </List>
      {idsDebug && ids && ids.map((id, index) => {
        return (
          <Link key={index} to={`/id/${id.tgid}`}>
            <Banner
              style={{
                borderTop: `1px solid ${sectionSeparatorColor}`,//var(--tg-theme-section-separator-color)`,
                backgroundColor: backgroundColor,
              }}
              before={<Person size={30} style={{color: accentTextColor}}/>}
              className='banner'
              description={id.tgid}
            />
          </Link>
        );
      })}
    </>
  );
};