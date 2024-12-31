import * as articleJson from './article.json';
import { FC } from 'react';

import { Article } from '@/components/Article/Article';

interface NK333_21PageProps {
  hash?: string
}

export const NK333_21Page: FC<NK333_21PageProps> = ( props ) => {
  return (
    <Article json={articleJson} hash={props.hash} />
  )
}