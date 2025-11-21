import useApiHook from '@/hooks/useApi';
import styles from './Messages.module.scss';
import Image from 'next/image';
import { IoSend } from 'react-icons/io5';
import Link from 'next/link';
import { CgChevronLeft } from 'react-icons/cg';
import { useEffect, useRef } from 'react';

type Props = {
  id: string;
};
const MessagesView = (props: Props) => {
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const { data, isLoading: isLoadingMessages } = useApiHook({
    url: '/messaging/' + props.id + '/messages?role=athlete',
    method: 'GET',
    key: ['messages', props.id],
    refetchInterval: 1000,
  }) as any;

  const { mutate, isLoading: isLoadingSend } = useApiHook({
    url: '/messaging/' + props.id + '/messages?role=athlete',
    method: 'POST',
    key: ['sendMessage'],
    queriesToInvalidate: ['messages', props.id],
  }) as any;

  const { mutate: markAsRead } = useApiHook({
    method: 'PUT',
    key: ['markMessageRead'],
    queriesToInvalidate: [`messages,${props.id}`],
  }) as any;

  useEffect(() => {
    // Set up Intersection Observer for the last message
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Last message is in view, mark as read
            const lastMessage = data?.payload?.messages[data.payload.messages.length - 1];
            if (lastMessage && lastMessage.sender.role !== 'athlete') {
              // Only mark as read if the last message is from the team (not sent by the athlete)
              markAsRead({
                url: `/messaging/admin/message/${lastMessage._id}`,
                formData: { read: true },
              });
            }
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of the message is visible
        rootMargin: '0px',
      }
    );

    // Observe the last message element
    if (lastMessageRef.current) {
      observerRef.current.observe(lastMessageRef.current);
    }

    // Cleanup observer on unmount
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [markAsRead]);

  if (isLoadingMessages || isLoadingSend || !data?.payload) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>Loading messages...</div>
      </div>
    );
  }

  const { participants, messages } = data.payload;
  const team = participants.team;

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = () => {
    const messageContent = (document.getElementById('messageInput') as HTMLInputElement).value;
    if (messageContent.trim() === '') return;
    mutate({ formData: { message: messageContent } });
    (document.getElementById('messageInput') as HTMLInputElement).value = '';
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link className={styles.backButton} aria-label="Back to Conversations" href="/messages">
          <CgChevronLeft size={24} />
        </Link>

        <Link className={styles.profileLink} href={`/team/${team._id}`}>
          <Image
            src={team.logos[0]?.href}
            alt={team.name || 'Team Logo'}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/no-photo.png';
            }}
            className={styles.profileImage}
            width={40}
            height={40}
          />
          <span className={styles.participantName}>{team.name || 'Unknown Team'}</span>
        </Link>
      </header>

      <div className={styles.messagesContainer}>
        {messages.map((message: any, index: number) => {
          const isOutgoing = message.sender.role === 'athlete';
          const isLastMessage = index === messages.length - 1;

          return (
            <div key={message._id} ref={isLastMessage ? lastMessageRef : null} className={`${styles.messageWrapper} ${isOutgoing ? styles.outgoing : styles.incoming}`}>
              <div className={styles.messageBubble}>
                <p className={styles.messageContent}>{message.content}</p>
                <div className={styles.messageFooter}>
                  <p className={styles.timestamp}>{formatTime(message.createdAt)}</p>
                  {!isOutgoing && message.read && (
                    <span className={styles.readIndicator} title="Read">
                      ✓✓
                    </span>
                  )}
                  {isOutgoing && !message.read && (
                    <span className={styles.sentIndicator} title="Sent">
                      ✓
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <footer className={styles.inputArea}>
        <input type="text" placeholder="Type a message..." className={styles.messageInput} id="messageInput" />
        <button className={styles.sendButton} aria-label="Send Message" onClick={handleSendMessage}>
          <IoSend size={20} />
        </button>
      </footer>
    </div>
  );
};

export default MessagesView;
