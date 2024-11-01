export function calcPosh(value: any, courtType: string) {//, benefitsSwitch: boolean, discountSwitch: boolean) {
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
    if (_sum <= 100000) {
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

    withBenefits = (benefits) > 0 ? (benefits) : 0;
    withDiscount30 = gospSou - discount30;
    return {
      step: s,
      gosp: gospSou.toFixed(2),
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
    if (_sum <= 100000) {
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
    let benefits = gospSou - benefitsSum;
    let discount30 = gospArb * 0.3; 
    let discount50 = gospArb * 0.5;

    withBenefits = (benefits) > 0 ? (benefits) : 0;
    withDiscount30 = gospArb - discount30;
    withDiscount50 = gospArb - discount50;

    return {
      step: s,
      gosp: gospArb.toFixed(2),
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

export function human(dosum: any) { // разрядность
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


export interface copyToClipboardProps {
  text: string;
  imageurl?: string;
}

const blobEnable = false;

function copyTextToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

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

export async function copyToClipboard(value: copyToClipboardProps) {
  if (blobEnable) {
    copyBlobToClipboard(value);
  } else {
    copyTextToClipboard(value.text);
  }
}

