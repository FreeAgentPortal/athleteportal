import { QueryClient } from '@tanstack/react-query';
import NewsCard from './components/cards/newsCard/NewsCard.component';
import ProfileCard from './components/cards/profileCard/ProfileCard.component';
import { DashboardRulesEngine } from './DashboardRulesEngine';
import RecentAthleteSignups from './components/cards/recentAthletes/RecentAthleteSignups.component';
import TwitterCard from './components/cards/twitterCard/TwitterCard.component';
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
  hideIf?: ((params: { profile: any; queryClient: QueryClient }) => boolean) | boolean;
}

export default [
  {
    title: 'Related News',
    component: ({ data }: CardComponentProps) => <NewsCard />,
    gridKey: 'news',
    order: 2,
    size: 2,
    isCard: true,
    // hideIf: DashboardRulesEngine.noNews,
  },
  {
    title: 'Profile',
    component: ({ data }: CardComponentProps) => <ProfileCard profile={data} />,
    gridKey: 'profile-card',
    order: 1,
    size: 4,
    isCard: false,
    hideIf: DashboardRulesEngine.profileIncomplete,
  },
  {
    title: 'Recent Athlete Signups',
    component: ({ data }: CardComponentProps) => <RecentAthleteSignups />,
    gridKey: 'recent-athlete-signups',
    order: 4,
    size: 1,
    isCard: true,
    // hideIf: DashboardRulesEngine.noRecentAthletes,
  },
  {
    title: 'Latest Updates',
    component: ({ data }: CardComponentProps) => (
      <TwitterCard feedUrl="https://rss.app/embed/v1/list/t1BZDo5ufDDD481P" feedTitle="Latest Updates" maxPosts={10} useTwitterIcon={true} />
    ),
    gridKey: 'rss-updates',
    order: 3,
    size: 2,
    isCard: false,
    // hideIf: DashboardRulesEngine.noRSSUpdates,
  },
] as Card[];
