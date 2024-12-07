
import { useEffect, useState } from 'react'

import { QRCodeStyling, /*browserImageTools*/ } from "@liquid-js/qr-code-styling";
import { accentTextColor, backgroundColor } from '../ConfigProvider/variables';

const txtColor = import.meta.env.VITE_TXT_COLOR;

export function QRCode_Styling({text}: {text: string}) {
  const [img, setImg] = useState<string>('');
  console.log(img);

  const qrCode = new QRCodeStyling({
    data: text,
    //image: "https://casebookkiller.github.io/poshlina-dev/Logo.svg",
    shape: "square",
    dotsOptions: {
      color: accentTextColor,
      type: "random-dot",
      size: 6,
    },
    cornersSquareOptions: {
      color: accentTextColor,
      type: "extra-rounded"
    },
    cornersDotOptions: {
      color: accentTextColor,
      type: "extra-rounded"
    },
    backgroundOptions: {
      color: backgroundColor,
      margin: 1
    },
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 1,
      imageSize: 0.5
    }
  });
  


  useEffect(() => {
    console.log('%cQRCode: %o', `color: ${txtColor}`, qrCode);
   
    function getSize(qrCode: QRCodeStyling) {
      return {width: qrCode.size?.width, height: qrCode.size?.height};
    }

    const size = getSize(qrCode);
    console.log(size);
        
    qrCode.serialize().then((code) => {
      if (code !== undefined) {
        setImg(code);
        let dataURL = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(code);
        let canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
        
        canvas.width = size.width || 0;
        canvas.height = size.height || 0;
        
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
    {/*
      <div className="App">
        <img src={`data:image/svg+xml;utf8,${encodeURIComponent(img)}`} />
      </div>
    */}
      <div className="App" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight:'300px',
        width:'auto',
        overflowY: 'hidden',
      }}>
        <canvas className="square" id='canvas' style={{
          display:'block',
          padding: 0,
          maxWidth: '100%',
          maxHeight: '100%',
          }}></canvas>
      </div>
    </>

  );
}
