import { themeParams, mainButton, popup, shareURL } from "@telegram-apps/sdk";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function MainButtonManipulator() {
  const location = useLocation();

  let mainButtonParams = {
    backgroundColor: themeParams.buttonColor() || '#2990ff',
    textColor: themeParams.buttonTextColor() || '#ffffff',
    text: 'Поделиться расчетом'
  }
  
  if (!mainButton.isMounted()) mainButton.mount();
  
  mainButton.setParams(mainButtonParams);
  
  if (location.pathname === '/sou' || location.pathname === '/arb') mainButton.mount();
  console.log('Добавлена главная кнопка', mainButton);

  useEffect(() => {
    console.log('location.pathname: ', location.pathname);
    if (location.pathname === '/sou' || location.pathname === '/arb') {
      mainButton.setParams({ text: 'Поделиться расчетом', isVisible: true, isEnabled: true });
      mainButton.mount();
    } else {
      mainButton.setParams({ text: 'Перейдите на страницу с расчетом', isVisible: false, isEnabled: true });
      mainButton.mount();
    }
    mainButton.onClick(() => {
      //alert('oops');
      try {
        console.log('mainButton.onCLick');
        popup.open({
            title: 'Поделиться расчетом!',
            message: 'Для того чтобы поделиться расчетом, нажмите на кнопку Ok.',
            buttons: [
              { id: 'btnproceed', type: 'default', text: 'Ok' },
              { id: 'btncancel', type: 'cancel' },
            ],
          })
          .then((buttonId: string|null) => {
            if (buttonId === 'btnproceed') {
              const url = 'https://t.me/GosPoshlinaDevBot/poshlina';
              shareURL(`Нашёл приложение ${url}`);
            } else {
              console.log(
                buttonId === null 
                  ? 'Пользователь не нажимал кнопок.'
                  : `Пользователь нажал кнопку с ID "${buttonId}"`
              );
            }
           
          });
  
        console.log(popup.isOpened); // true
        
        console.log('Окно выбора чата открыто для отправки сообщения.');
      } catch (error) {
        console.error('Ошибка при открытии окна выбора чата:', error);
      }
    })
  }, [location]);

  return null;
  
}