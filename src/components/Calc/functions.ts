//!!!!! NEED TO BE IMPROVED !!!!!
//https://www.npmjs.com/package/qr-code-styling

//https://github.com/soldair/node-qrcode
import QRcode from 'qrcode';

export interface QRCodeProps {
  width?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  }
}

/**
 * Generates a QR code as a PNG image from a given string.
 * @param text The string to encode in the QR code.
 * @param props The options for generating the QR code.
 * @param callback If provided, the generated QR code will be passed as a blob to this function.
 * @returns The generated QR code URL or undefined if an error occurred.
 */
export const getQRCodePNG = (
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
}

/**
 * Generates a QR code as a string from a given string.
 * @param text The string to encode in the QR code.
 * @param props The options for generating the QR code.
 * @param callback If provided, the generated QR code will be passed as a string to this function.
 * @returns The generated QR code string or undefined if an error occurred.
 */
export const getQRCodeString = (
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
}


/**
 * Generates a QR code as a Data URL from a given string.
 * @param text The string to encode in the QR code.
 * @param props The options for generating the QR code.
 * @param setBlob If provided, the generated QR code will be set as a blob to this state.
 * @returns The generated QR code URL.
 */
export const GenerateQRCode = (
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
}

/**
 * calcPosh - расчет суммы пошлины
 * @param {any} value 
 * @param {string} courtType
 * @returns {step, gosp, base, exceed, percent, fix, discount30, discount50, benefits, withBenefits, withDiscount30, withDiscount50} 
 */
export function calcPosh(
    value: any,
    courtType: string,
    benefitsSwitch?: boolean,
    discount30Switch?: boolean,
    discount50Switch?: boolean
  ) {//, benefitsSwitch: boolean, discountSwitch: boolean) {
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
  let sum = ''+dosum;
  sum = sum.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') // разрядность
  if (sum.indexOf('.')!==-1) {						   // к десяткам копеек добавляем ноль
    var b=sum.substr(sum.indexOf('.'),sum.length)
    if (b.length===2) sum+="0"
  }
  if (sum.indexOf(',')!==-1) {						   // к десяткам копеек добавляем ноль
    var b=sum.substr(sum.indexOf(','),sum.length)
    if (b.length===2) sum+='0';
  }
  sum = sum.replace(/^00\./,'0.'); // меняем 00. на 0,
  sum = sum.replace(/^00,/,'0.');
  sum = sum.replace(/\./g,','); // меняем тчк на зпт
  return sum;
}

export interface copyToClipboardProps {
  text: string;
  imageurl?: string;
}

const blobEnable = false;

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
async function copyBlobToClipboard(value: copyToClipboardProps) {
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

/**
 * Copies content to the clipboard. If blobEnable is true, copies either text or an image as a blob; 
 * otherwise, copies plain text.
 * @param value - An object containing either text to copy or a URL to an image. 
 * If text is provided, it copies the plain text. If an image URL is provided, it copies the image as a PNG blob.
 */
export async function copyToClipboard(value: copyToClipboardProps) {
  if (blobEnable) {
    copyBlobToClipboard(value);
  } else {
    copyTextToClipboard(value.text);
  }
}

