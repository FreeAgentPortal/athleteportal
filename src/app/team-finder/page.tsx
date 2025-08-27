import { Metadata } from 'next';
import PageLayout from '@/layout/page/Page.layout';
import { navigation } from '@/data/navigation';
import TeamFinder from '@/views/opportunity_hub/team_finder/TeamFinder.view';

// SEO metadata
export const metadata: Metadata = {
  title: 'Team Finder — Free Agent Portal',
  description: 'Search and discover teams actively recruiting athletes across all levels on the Free Agent Portal.',
  openGraph: {
    title: 'Team Finder — Free Agent Portal',
    description: 'Search and discover teams actively recruiting athletes across all levels on the Free Agent Portal.',
    url: 'https://freeagentportal.com/team-finder',
    siteName: 'Free Agent Portal',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Team Finder — Free Agent Portal',
    description: 'Search and discover teams actively recruiting athletes across all levels on the Free Agent Portal.',
  },
};

export default function TeamFinderPage() {
  return (
    <PageLayout pages={[navigation().opportunities_hub.links.team_finder]} largeSideBar>
      <TeamFinder />
    </PageLayout>
  );
}
