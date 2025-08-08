'use client';

import { navigation } from '@/data/navigation';
import PageLayout from '@/layout/page/Page.layout';
import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import MessagesView from '@/views/opportunity_hub/messages/messages/Messages.view';

const Messages = () => {
  const params = useParams();

  const id = params.id as string;
  return (
    <PageLayout pages={[navigation().opportunities_hub.links.messages]} largeSideBar>
      <Suspense fallback={<div>Loading Messages...</div>}>
        <MessagesView id={id} />
      </Suspense>
    </PageLayout>
  );
};

export default Messages;
