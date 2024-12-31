import * as articleJson from './article.json';
import { FC } from 'react';

import { Article } from '@/components/Article/Article';

interface NK333_36PageProps {
  hash?: string
}

export const NK333_36Page: FC<NK333_36PageProps> = ( props ) => {
  return (
    <Article json={articleJson} hash={props.hash} />
  )
}