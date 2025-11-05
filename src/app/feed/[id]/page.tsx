import React from 'react';
import PostDetail from '@/views/feed/postDetail/PostDetail.view';
import PageLayout from '@/layout/page/Page.layout';
import { navigation } from '@/data/navigation';

export default async function PostDetailPage({ params }: { params: { id: string } }) {
  // await params
  const { id } = await params;
  return (
    <PageLayout pages={[navigation().home.links.feed]} largeSideBar>
      <PostDetail postId={id} />
    </PageLayout>
  );
}
