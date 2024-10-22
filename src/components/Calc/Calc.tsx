import {
  Typography,
  Button,
  List,
  Switch,
  InputNumber,
  Space
} from 'antd';
import {
  CopyOutlined
} from '@ant-design/icons';
import { } from 'antd-mobile';

import { useRef, useState, type FC, type ReactNode} from 'react';

import {
  hintColor,
  sectionHeaderTextColor,
} from '@/components/configprovider/variables';
import { Link } from '../Link/Link';

import '../configprovider/list.css';
import './Calc.css';
import { popup } from '@telegram-apps/sdk';

const { Title, Text } = Typography;

interface copyToClipboardProps {
  text: string;
  imageurl?: string;
}

async function copyToClipboard(value: copyToClipboardProps) {
  let _text, _image;
  if (value.text) _text = new Blob([value.text], {type: 'text/plain'});
  if (value.imageurl) _image = await fetch(value.imageurl).then(response => response.blob());

  const _props: Record<string, string | Blob | PromiseLike<string | Blob>> = {
    "text/plain": _text ? _text : '',
  };
  _props["image/png"] = _image ? _image : '';

  const item = new ClipboardItem(_props);
  await window.navigator.clipboard.write([item]);
}


export interface CalcProps {
  header?: ReactNode;
  footer?: ReactNode;
  sum?: ReactNode;
  posh?: ReactNode;
  setSum?: React.Dispatch<React.SetStateAction<string>>;
  setPosh?: React.Dispatch<React.SetStateAction<string>>;
}

export const Calc: FC<CalcProps> = ({ header, footer, sum, posh, setSum, setPosh }) => {
  const [courtType/*, setCourtType*/] = useState<string>('obsh');

  const inputSumEl = useRef<HTMLInputElement>(null);

  const [benefitsSwitch, setBenefitsSwitch] = useState<boolean>(false);
  const [discountSwitch, setDiscountSwitch] = useState<boolean>(false);

  function human(dosum: any) { // разрядность
    let sum = ""+dosum;
    sum = sum.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') // разрядность
    if (sum.indexOf(".")!==-1) {						   // к десяткам копеек добавляем ноль
      var b=sum.substr(sum.indexOf("."),sum.length)
      if (b.length===2) sum+="0"
    }
    if (sum.indexOf(",")!==-1) {						   // к десяткам копеек добавляем ноль
      var b=sum.substr(sum.indexOf(","),sum.length)
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

  /*
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
  */

  function calcPosh(value: any) {
    //console.log('--- value: ',Number(value.replace(',','.')));
    //console.log('--- type: ',typeof(value));
    let sum;
    if (typeof(value) === 'string') {
      sum = Number(value.replace(',','.'));
    } else {
      sum = Number(value);
    }
    let gosp1=0;
    let gosp2=0;
    let opis=0;
    console.log('--- sum: ',sum);
    console.log('--- courtType: ',courtType);
    if (courtType==='obsh') {
      if (sum<=100000) {gosp1=4000; opis=1}
      if (sum>100000 && sum<=300000) {gosp1=(sum-100000)/100*3+4000; opis=2}
      if (sum>300000 && sum<=500000) {gosp1=(sum-300000)/100*2.5+10000; opis=3}
      if (sum>500000 && sum<=1000000) {gosp1=(sum-500000)/100*2+15000; opis=4}
      if (sum>1000000 && sum<=3000000) {gosp1=(sum-1000000)/100+25000; opis=5}
      if (sum>3000000 && sum<=8000000) {gosp1=(sum-3000000)/100*0.7+45000; opis=6}
      if (sum>8000000 && sum<=24000000) {gosp1=(sum-8000000)/100*0.35+80000; opis=7}
      if (sum>24000000 && sum<=50000000) {gosp1=(sum-24000000)/100*0.3+136000; opis=8}
      if (sum>50000000 && sum<=100000000) {gosp1=(sum-50000000)/100*0.2+214000; opis=9}
      if (sum>100000000) {gosp1=(sum-100000000)/100*0.15+314000; opis=10}
      if (gosp1>900000) gosp1=900000;
      return {gosp:gosp1.toFixed(2), opis:opis}
    } else {
      if (sum<=100000) {gosp2=10000;opis=1}
      if (sum>100000 && sum<=1000000) {gosp2=(sum-100000)/100*5+10000; opis=2}
      if (sum>1000000 && sum<=10000000) {gosp2=(sum-1000000)/100*3+55000; opis=3}
      if (sum>10000000 && sum<=50000000) {gosp2=(sum-10000000)/100+325000; opis=4}
      if (sum>50000000) {gosp2=(sum-50000000)/100*0.5+725000; opis=5}
      if (gosp2>10000000) gosp2=10000000
      return {gosp:gosp2, opis:0}
    }
  }

  async function showClipboard(value: any) {
    console.log('--- value: ',value);
    let promise = popup.open({
      title: 'Буфер обмена',
      message: value,
      buttons: [
        { id: 'btnproceed', type: 'default', text: 'Ok' },
        { id: 'btncancel', type: 'cancel' },
      ]
    });
    let buttonId = await promise;
    console.log('--- buttonId: ',buttonId);
  }

  return(
    <>
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
            size='large'
            value={sum?.toString()}
            style={{ 
              width: '100%' 
            }}
            decimalSeparator={','}
            formatter={value=>human(value)}
            suffix=' '
            onChange={value => {
                if (setSum !== undefined) {
                  if (value===null) setSum('');
                if (value) {
                  setSum(value.toString());
                }
                let gospl = calcPosh(value).gosp;
                if (setPosh !== undefined) setPosh(gospl.toString().replace('.',','));
              }
            }}
            onKeyUp={onKeyPress}
            min={'0'}
            step={0.01}
            precision={2}
            placeholder='Цена иска'
          />
        </List.Item>
        <List.Item
          onClick={() => {
            setBenefitsSwitch(!benefitsSwitch);
            if (discountSwitch === true) {
              setBenefitsSwitch(false);
            }
          }}
          className={'hoverable'}
        >
          <List.Item.Meta
            title={<Text type={'success'}>Льгота -25 000 р.</Text>}
            description={<><Text style={{color: hintColor}} className='unselectable'><Link to='/' tabIndex={-1}>Льготные категории</Link> плательщиков определены п.2, п.3 ст.333.36 НК РФ.</Text></>}  
          />
          <Switch
            checked={benefitsSwitch}
            tabIndex={-1}
          />
        </List.Item>
        <List.Item
          onClick={() => {
            setDiscountSwitch(!discountSwitch);
            if (benefitsSwitch === true) {
              setBenefitsSwitch(false);
            }
          }}
          className={'hoverable'}
        >
          <List.Item.Meta
            title={<Text type={'success'}>Скидка в 30%</Text>}
            description={<><Text style={{color: hintColor}} className='unselectable'><Link to='/' tabIndex={-1}>Ситуации</Link> для применения скидки в 30% определены пп.10 п.1 ст.333.19 НК РФ.</Text></>}  
          />
          <Switch
            checked={discountSwitch}
            tabIndex={-1}
          />
        </List.Item>
        <List.Item>
          <Space.Compact style={{width: '100%'}}>
            <InputNumber
              id='posh'
              size='large'
              style={{
                width: '100%'
              }}
              value={posh !== undefined ? posh?.toString() : ''}
              onChange={() => posh}
              onKeyDown={e => {
                console.log(e);
                e.preventDefault();
                }
              }
              decimalSeparator={','}
              formatter={value=>human(value)}
              suffix=' '
              readOnly={true}  
            />
            <div style={{width: '8px'}}/>
            <Button
              type='primary'
              style={{
              height: '52px',
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
              <CopyOutlined />
            </Button>
          </Space.Compact>
        </List.Item>
      </List>
    {/*
      <Section header={header} footer={footer}>
        <Form.Item
          label={
            <Title level={4}>
              <Text type='success'>Калькулятор пошлины</Text>
            </Title>
          }
          name={'courtType'}
        >
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
          </Space>
        </Form.Item>
      </Section>
    */}
      </>
    )
  };

