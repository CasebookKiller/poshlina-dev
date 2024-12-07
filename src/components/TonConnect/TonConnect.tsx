import { Cell, Image } from "@telegram-apps/telegram-ui";
import { FC } from "react";
import { Link } from "react-router-dom";

import tonSvg from './ton.svg';

export const TonConnect: FC = () => {
  return (
    <Link to='/ton-connect'>
      <Cell
        before={<Image src={tonSvg} style={{ backgroundColor: '#5288C1' }}/>}
        subtitle='Подключите кошелек TON'
      >
        TON Connect
      </Cell>
    </Link>
  );
}