import { FC, useEffect, useRef } from "react";
import { ConfigProvider, List } from "antd-mobile"

import './NK333_36Page.css'
import * as articleJson from './NK333_36Page.json';

import ruRU from "antd-mobile/es/locales/ru-RU";
interface NK333_36PageProps {
  hash?: string
  editionDate?: string
}

interface ItemContentProps {
  id?: string
  children?: React.ReactNode
}
const ItemContent: FC<ItemContentProps> = (props: ItemContentProps) => {
  console.log('props.id', props?.id);
  return (<div id={props?.id || ''} className='list-item-content'>{props.children}</div>);
};

interface ItemContentPrefixProps {
  id?: string,
  children?: React.ReactNode
}
const ItemContentPrefix: FC<ItemContentPrefixProps> = (props: ItemContentPrefixProps) => {
  return (<span key={props?.id || ''} className='list-item-prefix'>{props.children}</span>);
}

export const NK333_36Page: FC<NK333_36PageProps> = ( props ) => {
  const hash = window.location.hash.replace('#/','/').split('#');
  const toid = hash.length > 1 ? hash[1] : '';
  
  const hdr = useRef<HTMLDivElement>(null);
  const refs = useRef<HTMLDivElement[]>([]);
  
  const article = articleJson.article;
  
  let to = -1;
  
  to = article.findIndex((item)=>{
    return item?.id !== '' && item?.id === toid || item?.id !== '' && item?.id === props.hash;
  });
  
  const listItems = article.map((item, index)=>{
    return (
      <div key={index} id={item?.id||''} ref={el=>refs.current[index]=el!}>
        <List.Item prefix={<ItemContentPrefix>{item?.prx||''}</ItemContentPrefix>}>
          <ItemContent>
            {item.text}
          </ItemContent>
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
      <ConfigProvider locale={ruRU}>
        <List
          className='list'
          header={<h5 ref={hdr} className='listHeader'>{articleJson.title}</h5>}>
          {listItems}
        </List>
      </ConfigProvider>
    </>
  );
}