'use client';
import React from 'react';
import styles from './Conversations.module.scss';
import useApiHook from '@/hooks/useApi';
import Image from 'next/image';
import Link from 'next/link';

const ConversationsView = () => {
  const { data, isFetching } = useApiHook({
    url: '/messaging?role=athlete',
    method: 'GET',
    key: 'conversations',
  }) as any;

  if (isFetching) {
    return <div>Loading Messages...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.messagesList}>
        {data?.payload?.length > 0 ? (
          data.payload
            .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .map((conversation: any) => (
              <Link href={`/messages/${conversation._id}`} key={conversation._id} className={styles.messageItem}>
                <div className={styles.messageHeader}>
                  <Image
                    src={conversation.participants.team?.logos[0].href || '/images/no-photo.png'}
                    alt={conversation.participants.team?.name || 'Unknown Team'}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/no-photo.png';
                    }}
                    className={styles.profileImage}
                    width={50}
                    height={50}
                  />
                  <span className={styles.senderName}>{conversation.participants.team?.name || 'Unknown Team'}</span>
                  <span className={styles.lastMessageTime}>{new Date(conversation.updatedAt).toLocaleTimeString()}</span>
                </div>
              </Link>
            ))
        ) : (
          <div className={styles.noMessages}>No messages found</div>
        )}
        {data?.payload?.length === 0 && !isFetching && <div className={styles.noMessages}>No conversations available</div>}
      </div>
    </div>
  );
};

export default ConversationsView;
