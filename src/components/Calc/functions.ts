//!!!!! NEED TO BE IMPROVED !!!!!
//https://www.npmjs.com/package/qr-code-styling

import { Code } from "react-bootstrap-icons";
const txtColor = import.meta.env.VITE_TXT_COLOR;
//https://github.com/soldair/node-qrcode
//import QRcode from 'qrcode';

export interface QRCodeProps {
  width?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  }
}

export type Param = {
  name: string,
  index: number,
  value: string
}

/**
 * Generates a QR code as a PNG image from a given string.
 * @param text The string to encode in the QR code.
 * @param props The options for generating the QR code.
 * @param callback If provided, the generated QR code will be passed as a blob to this function.
 * @returns The generated QR code URL or undefined if an error occurred.
 */
/*export const getQRCodePNG = (
  text: string, 
  props: QRCodeProps, 
  callback?: (url: string) => void,
) => {
  QRcode.toDataURL(text, props, (err, url) => {
    if (err) {
      console.error(err);
      return;
    } else {
      if (callback) {
        callback(url);
      }
    }
  });
}*/

/**
 * Generates a QR code as a string from a given string.
 * @param text The string to encode in the QR code.
 * @param props The options for generating the QR code.
 * @param callback If provided, the generated QR code will be passed as a string to this function.
 * @returns The generated QR code string or undefined if an error occurred.
 */
/*export const getQRCodeString = (
  text: string, 
  props: QRCodeProps, 
  callback?: (url: string) => void
) => {
  QRcode.toString(text, props, (err, url) => {
    if (err) {
      console.error(err);
      return;
    } else {
      if (callback) {
        callback(url);
      }
    }
  });
}*/

/**
 * Generates a QR code as a Data URL from a given string.
 * @param text The string to encode in the QR code.
 * @param props The options for generating the QR code.
 * @param setBlob If provided, the generated QR code will be set as a blob to this state.
 * @returns The generated QR code URL.
 */
/*export const GenerateQRCode = (
  text: string, 
  props: QRCodeProps, 
  setBlob?: React.Dispatch<React.SetStateAction<string>>
) => {
  QRcode.toDataURL(text, props, (err, url) => {
    if (err) {
      console.error(err);
      return;
    } else {
      if (setBlob) {
        setBlob(url);
      }
  
      return url;
    }
  });
}*/

/**
 * calcPosh - расчет суммы пошлины
 * @param {any} value 
 * @param {string} courtType
 * @returns {step, gosp, base, exceed, percent, fix, discount30, discount50, benefits, withBenefits, withDiscount30, withDiscount50} 
 */
export const calcPosh = (
    value: string,
    courtType: string,
    benefitsSwitch?: boolean,
    discount30Switch?: boolean,
    discount50Switch?: boolean
  ) => {
  let _sum;
  if (typeof(value) === 'string') {
    _sum = Number(value.replace(',','.'));
  } else {
    _sum = Number(value);
  }
  let gospSou = 0;
  let gospArb = 0;
  let s = 0; // step
  let b = 0; // base
  let e = 0; // exceed
  let p = 0; // percent
  let f = 0; // fix
  let withBenefits = 0; 
  let withDiscount30 = 0;
  let withDiscount50 = 0;

  if (courtType === 'obsh' || courtType === '') {
    if (_sum > 0 && _sum <= 100000) {
      f = 4000;
      gospSou = f; s = 1}
    if (_sum > 100000 && _sum <= 300000) {
      b = 100000; e = _sum - b; f = 4000; p = 3;
      gospSou = (e) / 100 * p + f; s = 2;
    }
    if (_sum > 300000 && _sum <= 500000) {
      b = 300000; e = _sum - b; f = 10000; p = 2.5;
      gospSou = (e) / 100 * p + f; s = 3;
    }
    if (_sum > 500000 && _sum <= 1000000) {
      b = 500000; e = _sum - b; f = 15000; p = 2;
      gospSou = (e) / 100 * p + f; s = 4;
    }
    if (_sum > 1000000 && _sum <= 3000000) {
      b = 1000000; e = _sum - b; f = 25000; p = 1;
      gospSou = (e) / 100 * p + f; s = 5;
    }
    if (_sum > 3000000 && _sum <= 8000000) {
      b = 3000000; e = _sum - b; f = 45000; p = 0.7;
      gospSou = (e) / 100 * p + f; s = 6;
    }
    if (_sum > 8000000 && _sum <= 24000000) {
      b = 8000000; e = _sum - b; f = 80000; p = 0.35;
      gospSou = (e) / 100 * p + f; s = 7;
    }
    if (_sum > 24000000 && _sum <= 50000000) {
      b = 24000000; e = _sum - b; f = 136000; p = 0.3;
      gospSou = (e) / 100 * p + f; s = 8;
    }
    if (_sum > 50000000 && _sum <= 100000000) {
      b = 50000000; e = _sum - b; f = 214000; p = 0.2;
      gospSou = (e) / 100 * p + f; s = 9;
    }
    if (_sum > 100000000) {
      b = 100000000; e = _sum - b; f = 314000; p = 0.15;
      gospSou = (e) / 100 * p + f; s = 10;
    }
    if (gospSou > 900000) gospSou = 900000;

    let benefitsSum: number = 25000;
    let benefits: number = gospSou - benefitsSum;
    let discount30: number = gospSou * 0.3; 

    if (benefitsSwitch && benefits > 0) { gospSou = benefits; } else if (benefitsSwitch) { gospSou = 0; }
    if (discount30Switch) gospSou -= discount30;

    withBenefits = (benefits) > 0 ? (benefits) : 0;
    withDiscount30 = gospSou - discount30;
    return {
      step: s,
      gosp: gospSou.toFixed(0),
      base: b.toFixed(2),
      exceed: e.toFixed(2),
      percent: p.toFixed(2),
      fix: f.toFixed(2),
      discount30: discount30.toFixed(2),
      discount50: 0,
      benefits: benefitsSum,
      withBenefits: withBenefits.toFixed(2),
      withDiscount30: withDiscount30.toFixed(2),
      withDiscount50: gospSou.toFixed(2),
    }
  } else {
    if (_sum > 0 && _sum <= 100000) {
      f = 10000;
      gospArb = f; s = 1}
    if (_sum > 100000 && _sum <= 1000000) {
      b = 100000; e = _sum - b; f = 10000; p = 5;
      gospArb = (e) / 100 * p + f; s = 2;
    }
    if (_sum > 1000000 && _sum <= 10000000) {
      b = 1000000; e = _sum - b; f = 55000; p = 3;
      gospArb = (e) / 100 * p + f; s = 3;
    }
    if (_sum > 10000000 && _sum <= 50000000) {
      b = 10000000; e = _sum - b; f = 325000; p = 1;
      gospArb = (_sum - 10000000) / 100 * p + f; s = 4;
    }
    if (_sum > 50000000) {
      b = 50000000; e = _sum - b; f = 725000; p = 0.5;
      gospArb = (e) / 100 * p + f; s = 5;
    }
    if (gospArb > 10000000) gospArb = 10000000;

    let benefitsSum = 55000;
    let benefits = gospArb - benefitsSum;
    let discount30 = gospArb * 0.3; 
    let discount50 = gospArb * 0.5;

    if (benefitsSwitch && benefits > 0) { gospArb = benefits; } else if (benefitsSwitch) { gospArb = 0; }
    if (discount30Switch) gospArb -= discount30;
    if (discount50Switch) gospArb -= discount50;

    withBenefits = (benefits) > 0 ? (benefits) : 0;
    withDiscount30 = gospArb - discount30;
    withDiscount50 = gospArb - discount50;

    return {
      step: s,
      gosp: gospArb.toFixed(0),
      base: b.toFixed(2),
      exceed: e.toFixed(2),
      percent: p.toFixed(2),
      fix: f.toFixed(2),
      discount30: discount30.toFixed(2),
      discount50: discount50.toFixed(2),
      benefits: benefitsSum,
      withBenefits: withBenefits.toFixed(2),
      withDiscount30: withDiscount30.toFixed(2),
      withDiscount50: withDiscount50.toFixed(2),
    }
  }
}
  
/**
 * fixed2 - отбрасывает все цифры после 2 цифр после запятой
 * @param {string} e 
 * @returns {string}
 */
export function fixed2(e: string ) {
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

/**
 * human - приводит число к читабельной форме
 * @param {any} dosum 
 * @returns {string} 
 */
export function human(dosum: any) { // разрядность
  // исправить
  let sum = ''+dosum;
  sum = sum.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') // разрядность
  if (sum.indexOf('.')!==-1) {						   // к десяткам копеек добавляем ноль
    let b=sum.substring(sum.indexOf('.'),sum.length)
    if (b.length===2) sum+="0"
  }
  if (sum.indexOf(',')!==-1) {						   // к десяткам копеек добавляем ноль
    let b=sum.substring(sum.indexOf(','),sum.length)
    if (b.length===2) sum+='0';
  }
  sum = sum.replace(/^00\./,'0.'); // меняем 00. на 0,
  sum = sum.replace(/^00,/,'0.');
  sum = sum.replace(/\./g,','); // меняем тчк на зпт
  return sum;
}

/*
export function human2(dosum: any) { // разрядность
  let sum = "" + dosum;
  sum = sum.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') // разрядность
  if (sum.indexOf(".")!=-1) {						   // к десяткам копеек добавляем ноль
    let b=sum.substring(sum.indexOf("."),sum.length)
    if (b.length==2) sum+="0"
  }
  if (sum.indexOf(",")!=-1) {						   // к десяткам копеек добавляем ноль
    let b=sum.substring(sum.indexOf(","),sum.length)
    if (b.length==2) sum+="0"
  }
  sum = sum.replace(/^00\./,'0,') // меняем 00. на 0,
  sum = sum.replace(/^00,/,'0,')
  sum = sum.replace(/\./g,',') // меняем тчк на зпт
  return sum
}
*/

export interface copyToClipboardProps {
  text: string;
  imageurl?: string;
  blob?: Blob;
}

const blobEnable = true;

/**
 * copyTextToClipboard - копирует текст в буфер
 * @param text 
 */
function copyTextToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

/**
 * Копирует блоб в буфер
 * @param value - объект с текстом или ссылка на картинку. Если текст указывается копируется чистый текст. Если ссылка на картинку указывается копируется блоб PNG.
 */
async function copyBlobToClipboard(blob: Blob) {
  console.log('blob', blob);
  let _blob;
  if (blob) _blob = blob;

  const _props: Record<string, string | Blob | PromiseLike<string | Blob>> = {
    [blob.type]: _blob ? _blob : '',
  };

  const item = new ClipboardItem(_props);
  await window.navigator.clipboard.write([item]);
}

/**
 * Copies content to the clipboard. If blobEnable is true, copies either text or an image as a blob; 
 * otherwise, copies plain text.
 * @param value - An object containing either text to copy or a URL to an image. 
 * If text is provided, it copies the plain text. If an image URL is provided, it copies the image as a PNG blob.
 */
export async function copyToClipboard(value: copyToClipboardProps) {
  if (blobEnable) {
    if (value.blob) copyBlobToClipboard(value.blob);
  } else {
    copyTextToClipboard(value.text);
  }
}

/**
 * Prepare a string to be used as a hash, by removing everything after
 * the first occurrence of '##', '%23%23', '&&', or 'h', and replacing
 * '%2C', '&amp;', and '%3B' with ',', '&', and ';', respectively.
 * Additionally, replace all occurrences of '%20' with an empty string.
 * @param value The string to be prepared.
 * @returns The prepared string.
 */
export function prepareHash(value: string) {
  if (value.indexOf('##')!=-1) value = value.substring(0,value.indexOf('##'))
  if (value.indexOf('%23%23')!=-1) value = value.substring(0,value.indexOf('%23%23'))
  value = value.replace(/%2C/g,',').replace(/&amp;/g,'&').replace(/%3B/g,";")
  if (value.indexOf('&&')!=-1) value = value.substring(0,value.indexOf('&&'))
  if (value.indexOf('h')!=-1) value = value.substring(0,value.indexOf('h'))
  return value.replace(/%20/g,"");
}

/**
 * Extracts and decodes a substring from a given location hash based on a specified delimiter.
 * 
 * @param a - The delimiter string used to locate the starting point for extraction within the location hash.
 * @param locationhash - The hash string from which a substring will be extracted and decoded.
 * 
 * @returns The decoded substring, where specific characters are replaced according to custom rules:
 * - Characters 'u', 'i', 'm', 'o', 'e' are replaced with '+', '/', '*', '(', ')' respectively.
 * - Characters 'w', 'k', 'c', 'p', 'b', 's', 'v', 'd' are replaced with '00', '000', '0000', '00000', '000000', '0000000', '00000000', '000000000' respectively.
 * - Characters 'n', 't', 'j', 'r', 'f', 'h', '<', '>' are removed.
 */
export function cutlink(a: string, locationhash: string) {
  let str = locationhash;
  let a1 = str.substring(str.indexOf(a) + a.length);
  if (a1.indexOf("a") !== -1) a1 = a1.substring(0, a1.indexOf("a"));
  if (a1.indexOf("g") !== -1) a1 = a1.substring(0, a1.indexOf("g"));
  a1 = a1.replace(/[ntjrfh<>]/gi, '');
  a1 = a1.replace(/u/gi, '+').replace(/i/gi, '/').replace(/m/gi, '*').replace(/o/gi, '(').replace(/e/gi, ')');
  a1 = a1.replace(/w/gi, '00').replace(/k/gi, '000').replace(/c/gi, '0000').replace(/p/gi, '00000').replace(/b/gi, '000000').replace(/s/gi, '0000000').replace(/v/gi, '00000000').replace(/d/gi, '000000000');
  return a1;
}

export type Code = {
  benefitsSwitch: boolean;
  discount30Switch: boolean;
  discount50Switch: boolean;
  sou: string;
  arb: string;
}

/**
 * link2code - считывает параметры из hash и возвращает объект со значениями
 * @param {string} hash - строка, содержащая параметры. 
 * @returns {object} - объект со значениями
 */ 
export const link2code: (hash: string) => Code = (hash: string) => { 
  let benefitsSwitch = false;
  //let benefitsSwitch2 = false;
  let discount30Switch = false;
  //let discount30Switch2 = false;
  let discount50Switch = false;
  let sou = ''; let arb = ''; //let oraz = ''; let yrtb = '';

  if ( hash.indexOf('n') != -1 ) { benefitsSwitch = true; }
  else if ( hash.indexOf('t') != -1 ) { discount30Switch = true; }

  if ( hash.indexOf('g') != -1 ) {
    sou = human(cutlink('g', hash));
  }

  if ( hash.indexOf('j') != -1 ) { benefitsSwitch = true; }
  else if ( hash.indexOf('r') != -1 ) { discount30Switch = true; }
  else if ( hash.indexOf('f') != -1 ) { discount50Switch = true; }

  if ( hash.indexOf('a') != -1 ) {
    arb = human(cutlink('a', hash));
    //oraz = hash.substring(1, hash.length)+'h'+ (( location.hash.indexOf('hf') != -1 ) ? 'f' : '')
    //yrtb = oraz;
  }

  return {
    benefitsSwitch,
    //benefitsSwitch2: benefitsSwitch2,
    discount30Switch,
    //discount30Switch2: discount30Switch2,
    discount50Switch,
    sou,
    arb,
    //oraz: oraz,
    //yrtb: yrtb
  } as Code;
}

/**
 * Compare two Param objects.
 * @param a the first Param object
 * @param b the second Param object
 * @returns -1 if a.index < b.index, 1 if a.index > b.index, 0 if a.index == b.index
 */
export function compareProps( a: Param, b: Param ) {
  if ( a.index < b.index ) {
    return -1;
  }
  if ( a.index > b.index ) {
    return 1;
  }
  return 0;
}

/**
 * Converts a string representation of a number to a linkable string.
 * 
 * This function takes a string representation of a number and replaces certain
 * characters with others to create a linkable string. The characters are replaced
 * as follows:
 *   - Spaces are removed
 *   - Commas are replaced with periods
 *   - The strings '000000000', '00000000', '0000000', '000000', '00000', '0000', '000', and '00'
 *     are replaced with 'd', 'v', 's', 'b', 'p', 'c', 'k', and 'w' respectively.
 *   - The characters '+', '/', '*', '(', and ')' are replaced with 'u', 'i', 'm', 'o', and 'e' respectively.
 *   - If the string does not contain any of the characters '-uimoe', trailing zeros are removed.
 * 
 * @param ssum the string representation of the number to convert
 * @returns the linkable string
 */
export function sum2link(ssum: string) {
  if ( ssum != '' ) {
    ssum = '' + ssum;
    ssum = ssum
              .replace(/\s/g,'')
              .replace(/,/g,'.')
              .replace(/000000000/g,'d')
              .replace(/00000000/g,'v')
              .replace(/0000000/g,'s')
              .replace(/000000/g,'b')
              .replace(/00000/g,'p')
              .replace(/0000/g,'c')
              .replace(/000/g,'k')
              .replace(/00/g,'w')
              .replace(/\+/g,'u')
              .replace(/\//g,'i')
              .replace(/\*/g,'m')
              .replace(/\(/g,'o')
              .replace(/\)/g,'e');
    if ( /[-uimoe]/.test(ssum) != true ) {
      ssum = ssum.replace(/\.(\d)0$/,'.$1'); // 11.20 -> 11.2 если нет +-*()/
    }
    return ssum;
  } else {
    return '';
  }
}

export function sharelink(
  sou: string,
  arb: string,
  benefits: boolean,
  discount30: boolean,
  discount50: boolean,
  userid: string
) {
  //https://t.me/GosPoshlinaDevBot/poshlina?startapp=clcg214214nhbro99281932
  const applink = 'https://t.me/' + import.meta.env.VITE_BOT_NAME + '/' + import.meta.env.VITE_APP_NAME + '?startapp=';

  console.log('%csou: %o', `color: ${txtColor}`, sou);
  console.log('%carb: %o', `color: ${txtColor}`, arb);
  console.log('%cbenefits: %o', `color: ${txtColor}`, benefits);
  console.log('%cdiscount30: %o', `color: ${txtColor}`, discount30);
  console.log('%cdiscount50: %o', `color: ${txtColor}`, discount50);
  console.log('%cuserid: %o', `color: ${txtColor}`, userid);

  const bro = userid != '' ? 'bro' + userid : '';

  let a = '';
  let a1 = sou;
  let b = '';
  let b1 = arb;

  if ( a1 != '' ) {
    a += 'g' + sum2link(a1);
  }
  
  const aa = a1.replace(/ /g,'');
  if ( Number(aa) > 0 && benefits ) { 
    a += 'n';
  } else if ( Number(aa) > 0 && discount30 ) { 
    a += 't';
  }

  if ( a != '' ) {
    a = '' + applink + 'clc' + a + 'h';
  }

  const bb = b1.replace(/ /g,'');
    if ( b1 != '' ) {
    b += 'a' + sum2link(b1);
  }
  
  if ( Number(bb) > 0 && benefits ) {
    b += 'j';
  } else if ( Number(bb) > 0 && discount30 ) {
    b += 'r'; 
  } else if ( Number(bb) > 0 && discount50 ) { 
    b += 'f';
  }

  if ( b != '' ) {
    b = '' + applink + 'clc' + b + 'h';
  }
 
  return a != '' ? a + bro : b != '' ? b + bro : '';
}

export function getCode(SP: string) {
  let code: Code = {
    benefitsSwitch: false,
    discount30Switch: false,
    discount50Switch: false,
    sou: '',
    arb: ''
  };

  if (SP !== '') {
    console.log('%cПараметры запуска: %o', `color: ${txtColor}`, SP);

    const unOrderedParams: Param[] = [
      { name: 'clc', index: 0, value: '' },
      { name: 'bro', index: 0, value: '' }
    ];

    let orderedParams: Param[] = [];

    const arr: string[] = SP?.split(/clc|bro/) ?? [];
    
    if (arr.length < 2) return;  

    unOrderedParams.forEach((item) => {
      if (SP?.includes(item.name)) {
        item.index = SP.indexOf(item.name);
      }
    });

    orderedParams = unOrderedParams.sort( compareProps );
    orderedParams.forEach((item) => {
      item.value = arr[orderedParams.findIndex(x => x.name === item.name)+1];  
    });

    console.log('%cOrdered Params: %o', `color: ${txtColor}`, orderedParams);
    orderedParams.forEach((item) => {
      if (item.name === 'clc') {
        code = link2code(prepareHash(item.value));
        console.log('%cclc: %o', `color: ${txtColor}`, code);
      }
    })

  } else {
    console.log('%cБез параметров запуска!', `color: ${txtColor}`);
  }
  return code;
}


export function getOrderedParams(SP: string, arr: string[]) {
  //console.log('%carr: %o', `color: ${txtColor}`, arr);
  let orderedParams: Param[] = [];

  const unOrderedParams: Param[] = [
    { name: 'clc', index: 0, value: '' },
    { name: 'bro', index: 0, value: '' }
  ];
      
  if (arr.length < 2 && arr.length !== 0) return;  
  if (arr.length !== 0) {
    unOrderedParams.forEach((item) => {
      if (SP?.includes(item.name)) {
        item.index = SP.indexOf(item.name);
      }
    });
    orderedParams = unOrderedParams.sort( compareProps );
    orderedParams.forEach((item) => {
      item.value = arr[orderedParams.findIndex(x => x.name === item.name)+1];  
    });

    console.log('%cOrdered Params: %o', `color: ${txtColor}`, orderedParams);
  }

return (orderedParams);
}
