import * as articleJson from './article.json';
import { FC } from 'react';

import { Article } from '@/components/Article/Article';

interface NK333_19PageProps {
  hash?: string
}

export const NK333_19Page: FC<NK333_19PageProps> = ( props ) => {
  return (
    <Article json={articleJson} hash={props.hash} />
  )
}

/*
  style={{
    '--adm-color-border': 'var(--tg-theme-secondary-bg-color)',
    '--border-inner': 'solid 2px var(--adm-color-border)',
    backgroundColor: 'var(--tg-theme-secondary-bg-color)',
  } as React.CSSProperties}
*/