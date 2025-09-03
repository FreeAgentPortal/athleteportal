'use client';

import { navigation } from '@/data/navigation';
import PageLayout from '@/layout/page/Page.layout';
import TeamProfile from '@/views/team_profile/TeamProfile.view';
import { useParams } from 'next/navigation';

export default function TeamFinderPage() {
  const params = useParams();

  const id = params.id as string;
  return (
    <PageLayout pages={[navigation().opportunities_hub.links.team_finder]} largeSideBar>
      <TeamProfile teamId={id} />
    </PageLayout>
  );
}
