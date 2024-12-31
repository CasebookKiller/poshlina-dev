import * as articleJson from './article.json';
import { FC } from 'react';

import { Article } from '@/components/Article/Article';

interface NK333_37PageProps {
  hash?: string
}

export const NK333_37Page: FC<NK333_37PageProps> = ( props ) => {
  return (
    <Article json={articleJson} hash={props.hash} />
  )
}