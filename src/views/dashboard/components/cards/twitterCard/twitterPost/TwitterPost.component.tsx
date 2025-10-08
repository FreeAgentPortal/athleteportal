import React from 'react';
import styles from './TwitterPost.module.scss';
import { TwitterPost as TwitterPostType } from '../TwitterCard.types';
import { IoHeart, IoRepeat, IoChatbubble, IoOpenOutline } from 'react-icons/io5';

interface TwitterPostProps {
  post: TwitterPostType & {
    content?: string;
    link?: string;
  };
  compact?: boolean;
}

const TwitterPost = ({ post, compact = false }: TwitterPostProps) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}m`;
    }
    if (diffInHours < 24) {
      return `${diffInHours}h`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
  };

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className={`${styles.container} ${compact ? styles.compact : ''}`}>
      <div className={styles.header}>
        <div className={styles.authorInfo}>
          {post.author.profile_image_url && <img src={post.author.profile_image_url} alt={post.author.name} className={styles.avatar} />}
          <div className={styles.authorDetails}>
            <span className={styles.authorName}>{post.author.name}</span>
            <span className={styles.authorUsername}>@{post.author.username}</span>
          </div>
        </div>
        <span className={styles.timestamp}>{formatTime(post.created_at)}</span>
      </div>

      <div className={styles.content}>
        <p className={styles.text}>{compact ? truncateText(post.text, 120) : post.text}</p>
        {post.content && <p className={styles.description}>{compact ? truncateText(post.content, 150) : post.content}</p>}
      </div>

      <div className={styles.actions}>
        {post.link && (
          <div className={styles.action}>
            <a href={post.link} target="_blank" rel="noopener noreferrer" className={styles.link}>
              <IoOpenOutline className={styles.icon} />
              <span>Read More</span>
            </a>
          </div>
        )}

        {post.public_metrics && (
          <div className={styles.metrics}>
            <div className={styles.metric}>
              <IoChatbubble className={styles.icon} />
              <span>{formatNumber(post.public_metrics.reply_count)}</span>
            </div>
            <div className={styles.metric}>
              <IoRepeat className={styles.icon} />
              <span>{formatNumber(post.public_metrics.retweet_count)}</span>
            </div>
            <div className={styles.metric}>
              <IoHeart className={styles.icon} />
              <span>{formatNumber(post.public_metrics.like_count)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TwitterPost;
