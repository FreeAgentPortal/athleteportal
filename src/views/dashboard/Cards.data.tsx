import NewsCard from './components/cards/newsCard/NewsCard.component';
import PaymentCard from './components/cards/paymentCard/newsCard/PaymentCard.component';

export interface Card {
  title: string;
  component: React.ReactNode;
  gridKey: string;
  hideIf?: boolean;
}

export default [ 
  {
    title: 'Related News',
    component: <NewsCard />,
    gridKey: 'news',
  },
  {
    title: 'Payment',
    component: <PaymentCard />,
    gridKey: 'payment-card',
  },
] as Card[];
