import { Button } from "antd-mobile";
import { type FC, useState, useRef } from "react";
import { Camera, CameraType } from "react-camera-pro";

interface CameraProProps {
  description: string
}

export const CameraPro: FC<CameraProProps> = ({
  ...props
}) => {
  const camera = useRef<CameraType>(null);
  const [image, setImage] = useState<string|ImageData>('');
  return (
    <div>
      <Camera ref={camera} errorMessages={{
        noCameraAccessible: 'нет доступной камеры',
        permissionDenied: 'разрешения на доступ к камере отклонены',
        switchCamera: 'невозможно переключить камеру',
        canvas: 'невозможно вставить камеру в данное место',
      }} />
      <Button onClick={() => {
        if (camera.current) {
          const photo: string|ImageData = camera.current.takePhoto();
          console.log(photo);
          setImage(photo);
        }
        
      }}>Сделать снимок</Button>
      <Button onClick={() => {
        if (camera.current) {
          const photo: string|ImageData = camera.current.switchCamera();
          console.log(photo);
        }
        
      }}>Переключить камеру</Button>
      <div style={{margin: '30px', width: '100%', height: '100%'}}>
        <img src={image.toString()} alt='Сделать снимок'/>
      </div>
      <div>{props.description}</div>
    </div>
  )
}