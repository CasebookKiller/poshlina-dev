import { sectionBgColor, TCLR } from "@/components/init";

import { FC } from "react";
import { ConfigProvider, List } from "antd-mobile"

import './NK333_19Page.css'

import ruRU from "antd-mobile/es/locales/ru-RU";
interface NK333_19PageProps {
  hash?: string
  editionDate?: string
}

interface ItemContentProps {
  id?: string
  children: React.ReactNode
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

export const NK333_19Page: FC<NK333_19PageProps> = ( props ) => {
  console.log('%chash: %o', `color: ${TCLR}`, props.hash);
  console.log('%cNK333_19Page: %o', `color: ${TCLR}`, props.editionDate);
  const article = [
    {
      id: 'p1s333_19',
      prx: '1.',
      text: 'По делам, рассматриваемым Верховным Судом Российской Федерации в соответствии с гражданским процессуальным законодательством Российской Федерации и законодательством об административном судопроизводстве, судами общей юрисдикции, мировыми судьями, государственная пошлина уплачивается в следующих размерах:'
    },
    {
      id: 'pp1p1s333_19',
      prx: '1)',
      text: 'при подаче искового заявления имущественного характера, административного искового заявления имущественного характера, подлежащих оценке, при цене иска:'
    },
    {
      id: '',
      prx: '',
      text: 'до 100 000 рублей - 4000 рублей;'
    },
    {
      id: '',
      prx: '',
      text: 'от 100 001 рубля до 300 000 рублей - 4000 рублей плюс 3 процента суммы, превышающей 100 000 рублей;'
    },
    {
      id: '',
      prx: '',
      text: 'от 300 001 рубля до 500 000 рублей - 10 000 рублей плюс 2,5 процента суммы, превышающей 300 000 рублей;'
    },
    {
      id: '',
      prx: '',
      text: 'от 500 001 рубля до 1 000 000 рублей - 15 000 рублей плюс 2 процента суммы, превышающей 500 000 рублей;'
    },
    {
      id: '',
      prx: '',
      text: 'от 1 000 001 рубля до 3 000 000 рублей - 25 000 рублей плюс 1 процент суммы, превышающей 1 000 000 рублей;'
    },
    {
      id: '',
      prx: '',
      text: 'от 3 000 001 рубля до 8 000 000 рублей - 45 000 рублей плюс 0,7 процента суммы, превышающей 3 000 000 рублей;'
    },
    {
      id: '',
      prx: '',
      text: 'от 8 000 001 рубля до 24 000 000 рублей - 80 000 рублей плюс 0,35 процента суммы, превышающей 8 000 000 рублей;'
    },
    {
      id: '',
      prx: '',
      text: 'от 24 000 001 рубля до 50 000 000 рублей - 136 000 рублей плюс 0,3 процента суммы, превышающей 24 000 000 рублей;'
    },
    {
      id: '',
      prx: '',
      text: 'от 50 000 001 рубля до 100 000 000 рублей - 214 000 рублей плюс 0,2 процента суммы, превышающей 50 000 000 рублей;'
    },
    {
      id: '',
      prx: '',
      text: 'свыше 100 000 000 рублей - 314 000 рублей плюс 0,15 процента суммы, превышающей 100 000 000 рублей, но не более 900 000 рублей;'
    },
    {
      id: 'pp2p1s333_19',
      prx: '2)',
      text: 'при подаче заявления о вынесении судебного приказа - 50 процентов размера государственной пошлины, взимаемой при подаче искового заявления имущественного характера;'
    },
    {
      id: 'pp3p1s333_19',
      prx: '3)',
      text: 'при подаче искового заявления имущественного характера, не подлежащего оценке, искового заявления неимущественного характера:'
    },
    {
      id: '',
      prx: '',
      text: 'для физических лиц - 3000 рублей;'
    },
    {
      id: '',
      prx: '',
      text: 'для организаций - 20 000 рублей;'
    },
    {
      id: 'pp4p1s333_19',
      prx: '4)',
      text: 'при подаче искового заявления по спорам, возникающим при заключении, изменении или расторжении договоров, не содержащего требования о возврате исполненного по сделке или о присуждении имущества, а также искового заявления по спорам о признании сделок недействительными, не содержащего требования о применении последствий недействительности сделок:'
    },
    {
      id: '',
      prx: '',
      text: 'для физических лиц - 3000 рублей;'
    },
    {
      id: '',
      prx: '',
      text: 'для организаций - 20 000 рублей;'
    },
    {
      id: 'pp5p1s333_19',
      prx: '5)',
      text: 'при подаче искового заявления о расторжении брака - 5000 рублей;'
    },
    {
      id: 'pp6p1s333_19',
      prx: '6)',
      text: 'при подаче административного искового заявления об оспаривании (полностью или частично) нормативных правовых актов (нормативных актов) государственных органов, Центрального банка Российской Федерации, государственных внебюджетных фондов, органов местного самоуправления, органов публичной власти федеральной территории "Сириус", государственных корпораций, должностных лиц, при подаче административного искового заявления об оспаривании ненормативных правовых актов Президента Российской Федерации, Совета Федерации Федерального Собрания Российской Федерации, Государственной Думы Федерального Собрания Российской Федерации, Правительства Российской Федерации, Правительственной комиссии по контролю за осуществлением иностранных инвестиций в Российской Федерации, а также при подаче административного искового заявления об оспаривании актов федеральных органов исполнительной власти, иных федеральных государственных органов, Центрального банка Российской Федерации, государственных внебюджетных фондов, содержащих разъяснения законодательства и обладающих нормативными свойствами:'
    },
    {
      id: '',
      prx: '',
      text: 'для физических лиц - 4000 рублей;'
    },
    {
      id: '',
      prx: '',
      text: 'для организаций - 20 000 рублей;'
    },
    {
      id: 'pp7p1s333_19',
      prx: '7)',
      text: 'при подаче административного искового заявления о признании ненормативного правового акта недействительным и о признании решений и действий (бездействия) государственных органов, органов местного самоуправления, иных органов, должностных лиц незаконными:'
    },
    {
      id: '',
      prx: '',
      text: 'для физических лиц - 3000 рублей;'
    },
    {
      id: '',
      prx: '',
      text: 'для организаций - 15 000 рублей;'
    },
    {
      id: 'pp8p1s333_19',
      prx: '8)',
      text: 'при подаче заявления по делам особого производства - 3000 рублей;'
    },
    {
      id: 'pp9p1s333_19',
      prx: '9)',
      text: 'при подаче заявления о правопреемстве, кроме случаев универсального правопреемства:'
    },
    {
      id: '',
      prx: '',
      text: 'для физических лиц - 2000 рублей;'
    },
    {
      id: '',
      prx: '',
      text: 'для организаций - 15 000 рублей;'
    },
    {
      id: 'pp10p1s333_19',
      prx: '10)',
      text: 'при подаче заявления о выдаче исполнительных листов на принудительное исполнение решений третейского суда, заявлений о признании и об исполнении решения иностранного суда, иностранных третейских судов (арбитражей) - в размере 30 процентов государственной пошлины, исчисленной по правилам подпункта 1 настоящего пункта, исходя из суммы, подтвержденной соответствующим решением;'
    },
    {
      id: 'pp11p1s333_19',
      prx: '11)',
      text: 'при подаче заявления об отмене решения третейского суда - в размере государственной пошлины, исчисленной по правилам подпункта 1 настоящего пункта, исходя из оспариваемой заявителем суммы;'
    },
    {
      id: 'pp12p1s333_19',
      prx: '12)',
      text: 'при подаче заявления о выдаче дубликата исполнительного листа, о пересмотре заочного решения судом, вынесшим это решение, - 1500 рублей;'
    },
    {
      id: 'pp13p1s333_19',
      prx: '13)',
      text: 'при подаче заявления о восстановлении пропущенного срока для предъявления исполнительного листа к исполнению, об отсрочке или рассрочке исполнения судебного постановления, изменении способа и порядка его исполнения, о повороте исполнения судебного постановления, о разъяснении судебного постановления - 3000 рублей;'
    },
    {
      id: 'pp14p1s333_19',
      prx: '14)',
      text: 'при подаче заявления о пересмотре судебных постановлений по новым или вновь открывшимся обстоятельствам - 10 000 рублей;'
    },
    {
      id: 'pp15p1s333_19',
      prx: '15)',
      text: 'при подаче заявления об обеспечении иска, в том числе иска, рассматриваемого в третейском суде, о замене обеспечительной меры, об отмене обеспечения (за исключением заявлений о принятии предварительных обеспечительных мер защиты авторских и (или) смежных прав в информационно-телекоммуникационных сетях, в том числе в сети "Интернет") - 10 000 рублей;'
    },
    {
      id: 'pp16p1s333_19',
      prx: '16)',
      text: 'при подаче заявления по делам о взыскании алиментов - 150 рублей. Если судом выносится решение о взыскании алиментов как на содержание детей, так и на содержание истца, размер государственной пошлины увеличивается в два раза;'
    },
    {
      id: 'pp17p1s333_19',
      prx: '17)',
      text: 'при подаче административного искового заявления о присуждении компенсации за нарушение права на судопроизводство в разумный срок или права на исполнение судебного акта в разумный срок:'
    },
    {
      id: '',
      prx: '',
      text: 'для физических лиц - 300 рублей;'
    },
    {
      id: '',
      prx: '',
      text: 'для организаций - 6000 рублей;'
    },
    {
      id: 'pp18p1s333_19',
      prx: '18)',
      text: 'при подаче административного искового заявления о присуждении компенсации за нарушение условий содержания под стражей, содержания в исправительном учреждении - 300 рублей;'
    },
    {
      id: 'pp19p1s333_19',
      prx: '19)',
      text: 'при подаче апелляционной жалобы, частной жалобы, а также при подаче кассационной жалобы на судебный приказ:'
    },
    {
      id: '',
      prx: '',
      text: 'для физических лиц - 3000 рублей;'
    },
    {
      id: '',
      prx: '',
      text: 'для организаций - 15 000 рублей;'
    },
    {
      id: 'pp20p1s333_19',
      prx: '20)',
      text: 'при подаче кассационной жалобы:'
    },
    {
      id: '',
      prx: '',
      text: 'для физических лиц - 5000 рублей;'
    },
    {
      id: '',
      prx: '',
      text: 'для организаций - 20 000 рублей;'
    },
    {
      id: 'pp21p1s333_19',
      prx: '21)',
      text: 'при подаче кассационной жалобы:'
    },
    {
      id: '',
      prx: '',
      text: 'для физических лиц - 7000 рублей;'
    },
    {
      id: '',
      prx: '',
      text: 'для организаций - 25 000 рублей;'
    },
    //(п. 1 в ред. Федерального закона от 08.08.2024 N 259-ФЗ)
    //(см. текст в предыдущей редакции)
    {
      id: 'p2s333_19',
      prx: '2.',
      text: 'Положения настоящей статьи применяются с учетом положений статьи 333.20 настоящего Кодекса.'
    }
  ];

  const listItems = article.map(item=>{
    return (
      <List.Item prefix={<ItemContentPrefix>{item.prx}</ItemContentPrefix>}>
        <ItemContent id={item.id}>
          {item.text}
        </ItemContent>
      </List.Item>
    );
  })

return (
  <>
    <ConfigProvider locale={ruRU}>
      <List
        className='list'
        header={<h5 className='listHeader'>НК РФ, Статья 333.19 Размеры государственной пошлины по делам, рассматриваемым Верховным Судом Российской Федерации, судами общей юрисдикции, мировыми судьями</h5>}>
        {listItems}
      </List>
    </ConfigProvider>
  </>
);
}