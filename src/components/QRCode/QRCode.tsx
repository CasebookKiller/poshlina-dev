
import { useEffect, useState } from 'react'

import QRcode from 'qrcode';

import { QRCodeStyling } from "@liquid-js/qr-code-styling";

export function QRCode_Styling() {
  const [img, setImg] = useState<string>('');

  const qrCode = new QRCodeStyling({
    data: "https://www.facebook.com/",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
    dotsOptions: {
      color: "#4267b2",
      type: "rounded",
      size: 10
    },
    backgroundOptions: {
      color: "#e9ebee",
      margin: 1
    },
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 1,
      imageSize: 0.5
    }
  });
  
  useEffect(() => {
    console.log(qrCode);
    qrCode.serialize().then((img) => {
      if (img !== undefined) {
        setImg(img);
        let dataURL = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(img);
        let canvas: any = document.getElementById('canvas');
let ctx:any;
if (canvas?.getContext) {
  ctx = canvas.getContext('2d');
  // rest of your code
} else {
  console.error('Canvas element not found');
}

let _img = new Image();
_img.width = 500;
_img.height = 500; 

_img.addEventListener('load', e => {
  ctx.drawImage(e.target, 0, 0);
});

_img.src = dataURL;
        }
    });
  }, []);

  
  
  return (
    <>
      <div className="App">
        <img src={`data:image/svg+xml;utf8,${encodeURIComponent(img)}`} />
      </div>
      <div className="App">
        <canvas width={310} height={310} id='canvas'></canvas>
      </div>
    </>

  );
}

interface QRCodeProps {
  width?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  }
}

export default function QRCode({ text, props, setBlob }: { text: string, props: QRCodeProps, setBlob?: React.Dispatch<React.SetStateAction<string>> }) {
  const [qr, setQr] = useState('');
  
  const GenerateQRCode = () => {
    QRcode.toDataURL(text, props, (err, url) => {
      if (err) {
        console.error(err);
        return;
      }
      
      setQr(url);

      if (setBlob) {
        setBlob(url);
      }
    })
  }

  useEffect(() => {
    GenerateQRCode();
  })  

  return (
    <img src={qr} style={{ margin: '5px' }}/>
  )
}