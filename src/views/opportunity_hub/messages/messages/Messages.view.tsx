import useApiHook from '@/hooks/useApi';
import styles from './Messages.module.scss';
import Image from 'next/image';
import { IoSend } from 'react-icons/io5';
import Link from 'next/link';
import { CgChevronLeft } from 'react-icons/cg';

type Props = {
  id: string;
};
const MessagesView = (props: Props) => {
  const { data, isFetching } = useApiHook({
    url: '/messaging/' + props.id + '/messages?role=team',
    method: 'GET',
    key: ['messages', props.id],
  }) as any;

  const { mutate, isLoading } = useApiHook({
    url: '/messaging/' + props.id + '/messages?role=athlete',
    method: 'POST',
    key: ['sendMessage'],
    queriesToInvalidate: ['messages', props.id],
  }) as any;

  if (isFetching || isLoading) {
    return <div className={styles.container}>Loading messages...</div>;
  }

  const { participants, messages } = data.payload;
  const athlete = participants.athlete;

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
        <Link className={styles.backButton} aria-label="Back to Conversations" href="/opportunities_hub/messages">
          <CgChevronLeft size={24} />
        </Link>
        <Link className={styles.profileLink} href={`/opportunities_hub/athletes/${athlete._id}`}>
          <Image
            src={athlete.profileImageUrl || '/images/no-photo.png'}
            alt={athlete.fullName || 'Athlete'}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/no-photo.png';
            }}
            className={styles.profileImage}
            width={40}
            height={40}
          />
          <span className={styles.participantName}>{athlete.fullName || 'Conversation'}</span>
        </Link>
      </header>

      <div className={styles.messagesContainer}>
        {messages.map((message: any) => {
          const isOutgoing = message.sender.role === 'athlete';

          return (
            <div key={message._id} className={`${styles.messageWrapper} ${isOutgoing ? styles.outgoing : styles.incoming}`}>
              <div className={styles.messageBubble}>
                <p className={styles.messageContent}>{message.content}</p>
                <p className={styles.timestamp}>{formatTime(message.createdAt)}</p>
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
