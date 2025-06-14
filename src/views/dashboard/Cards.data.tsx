import NewsCard from './components/cards/newsCard/NewsCard.component';
import PaymentCard from './components/cards/paymentCard/PaymentCard.component';
import ProfileCard from './components/cards/profileCard/ProfileCard.component';
export interface CardComponentProps {
  data: any; // or AthleteProfile | TeamProfile | etc when you type it
}
export interface Card {
  title: string;
  component: (props: CardComponentProps) => React.ReactNode;
  order?: number; // lower number = higher priority
  size?: number; // NEW: size = column weight (1 = default, 2 = double-width, 3 = triple-width)
  gridKey: string;
  isCard?: boolean;
  hideIf?: boolean;
}

export default [
  {
    title: 'Related News',
    component: ({ data }: CardComponentProps) => <NewsCard />,
    gridKey: 'news',
    order: 2,
    size: 2,
    isCard: true,
  },
  {
    title: 'Payment',
    component: ({ data }: CardComponentProps) => <PaymentCard />,
    gridKey: 'payment-card',
    order: 3,
    size: 1,
    isCard: true,
  },
  {
    title: 'Profile',
    component: ({ data }: CardComponentProps) => <ProfileCard profile={data} />,
    gridKey: 'profile-card',
    order: 1,
    size: 3,
    isCard: false,
  },
] as Card[];
