import PageLayout from '@/layout/page/Page.layout';
import { navigation } from '@/data/navigation';
import Profile from '@/views/profile/Profile.view';

export const metadata = {
  title: 'FAP | Profile',
  description: 'Edit your profile details and preferences.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function Page() {
  return (
    <PageLayout pages={[navigation().account_details.links.profile]}>
      <Profile />
    </PageLayout>
  );
}
