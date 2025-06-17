import PageLayout from '@/layout/page/Page.layout';
import { navigation } from '@/data/navigation';
import Feed from '@/views/feed/Feed.view';

export default function Page() {
  return (
    <PageLayout pages={[navigation().home.links.feed]} largeSideBar>
      <Feed />
    </PageLayout>
  );
}
