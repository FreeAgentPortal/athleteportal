import { navigation } from '@/data/navigation';
import PageLayout from '@/layout/page/Page.layout';
import ConversationsView from '@/views/opportunity_hub/messages/conversations/Conversations.view';
import React, { Suspense } from 'react';

const Conversations = () => {
  return (
    <PageLayout pages={[navigation().opportunities_hub.links.messages]} largeSideBar>
      <Suspense fallback={<div>Loading Messages...</div>}>
        <ConversationsView />
      </Suspense>
    </PageLayout>
  );
};

export default Conversations;
