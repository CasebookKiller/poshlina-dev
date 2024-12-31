import { FC, useEffect, useRef } from "react";
import { ConfigProvider } from "antd-mobile"

import { List } from "antd";

import ruRU from "antd-mobile/es/locales/ru-RU";
import { backgroundColor, outlineColor, textColor, } from "@/components/init";
import { PrimeReactProvider } from "primereact/api";

import { Typography } from "antd";
const { Title, Text } = Typography;

interface ItemContentProps {
  id?: string
  children?: React.ReactNode
}
const ItemContent: FC<ItemContentProps> = (props: ItemContentProps) => {
  console.log('props.id', props?.id);
  return (<div id={props?.id || ''} style={{color: textColor}}className='list-item-content'>{props.children}</div>);
};

interface ItemContentPrefixProps {
  id?: string,
  children?: React.ReactNode
}
const ItemContentPrefix: FC<ItemContentPrefixProps> = (props: ItemContentPrefixProps) => {
  return (<span key={props?.id || ''} className='list-item-prefix'>{props.children}</span>);
}

export interface ArticleProps {
  json: any
  hash?: string
}

export const Article: FC<ArticleProps> = (props: ArticleProps) => {
  const hash = window.location.hash.replace('#/','/').split('#');
  const toid = hash.length > 1 ? hash[1] : '';
  
  const hdr = useRef<HTMLDivElement>(null);
  const refs = useRef<HTMLDivElement[]>([]);
  
  const article = props.json.article;
  const title = props.json.title;
  
  let to = -1;
  
  to = article.findIndex((item: any)=>{
    return item?.id !== '' && item?.id === toid || item?.id !== '' && item?.id === props.hash;
  });
  const listItems = article.map((item: any, index: number)=>{
    return (
      <div key={index} id={item?.id||''} ref={el=>refs.current[index]=el!}>
        <List.Item
          style={{borderTop: '2px solid ' + outlineColor }}
        >
          <List.Item.Meta
            avatar={<ItemContentPrefix>{item?.prx||''}</ItemContentPrefix>}
            description={<ItemContent>
              {item.text}
            </ItemContent>}
          />
        </List.Item>
      </div>
    );
  })

  const executeScroll = (index: number) => {
    const result = refs.current[index].scrollIntoView();
    return result;
  }   

  useEffect(()=>{
    if (to > -1) { executeScroll(to); } else { hdr.current?.scrollIntoView(); }
  },[]);

  return (
    <>
      <PrimeReactProvider value={{unstyled: false}}>
        <ConfigProvider
          locale={ruRU}
        >
          <List
            header={
              <Title
                level={5}
                className='listHeader'>
                <Text
                  type='success'
                >
                  {title}
                </Text>
              </Title>
            }
            style={{background: backgroundColor}}
          >
            {listItems}
          </List>
        </ConfigProvider>
      </PrimeReactProvider>
    </>
  );
}
