/***
 * Examples
 */

//https://api.telegram.org/bot${tg.token}/sendMessage?chat_id=${tg.chat_id}&text=${text}`

/*{
  "status": "done",
  "payload": {
    "ok": true,
    "result": {
      "message_id": 24,
      "from": {
        "id": 7989859769,
        "is_bot": true,
        "first_name": "Калькулятор пошлины",
        "username": "tgfee_bot"
      },
      "chat": {
        "id": 275342303,
        "first_name": "Алексей",
        "last_name": "Кузнецов",
        "username": "kuznetsov_proff",
        "type": "private"
      },
      "date": 1733826984,
      "text": "Калькулятор пошлины загружен."
    }
  }
}*/


/*
fetchBot(
  'sendMessage',
  request,
  (data) => {
    console.log('%ccalcLoaded: %o', `color: ${TCLR}`, data);
  },
  (error) => {
    console.log('%cerror: %o', `color: ${TCLR}`, error);
  }
);*/
