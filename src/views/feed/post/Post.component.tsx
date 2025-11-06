'use client';
import React from 'react';
import Image from 'next/image';
import { BiComment } from 'react-icons/bi';
import { RiShareForwardLine } from 'react-icons/ri';
import { Post as PostType } from '@/types/ISocialPost';
import { renderPostContent } from '../utils/renderPostContent';
import { usePostView } from '../hooks/usePostView';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import styles from './Post.module.scss';
import ReactionSummary from '../components/reactionSummary/ReactionSummary.component';
import ReactionButton from '../components/reactionButton/ReactionButton.component';

interface PostProps {
  post: PostType;
}

const Post = ({ post }: PostProps) => {
  dayjs.extend(relativeTime);

  // Track post views - returns a callback ref
  const containerRef = usePostView({ postId: post._id, threshold: 5000 });

  // Get interaction data from backend
  const interactions = (post as any)?.interactions;

  const profile = (post?.objectDetails as any)?.profile;
  const profileImageUrl = profile?.profileImageUrl;
  const authorName = profile?.fullName;

  return (
    <div ref={containerRef} className={styles.container}>
      {/* Post Header */}
      <div className={styles.header}>
        <div className={styles.authorInfo}>
          <div className={styles.avatar}>
            {profileImageUrl ? (
              <Image src={profileImageUrl} alt={authorName} width={40} height={40} className={styles.avatarImage} />
            ) : (
              <div className={styles.avatarPlaceholder}>{authorName.charAt(0).toUpperCase()}</div>
            )}
          </div>
          <div className={styles.authorDetails}>
            <span className={styles.authorName}>{authorName}</span>
            <span className={styles.timestamp}>{dayjs(post?.createdAt).fromNow()}</span>
          </div>
        </div>
        <div className={styles.actions}>
          {/* TODO: Add post menu (edit, delete, etc.) */}
          {/* <button className={styles.menuButton}>⋯</button> */}
        </div>
      </div>

      {/* Post Content - Dynamic based on type */}
      <div className={styles.content}>{renderPostContent({ post: post as any, mode: 'feed', postId: post._id })}</div>

      {/* Reaction Summary */}
      <ReactionSummary reactionBreakdown={interactions?.reactionBreakdown} totalReactions={interactions?.counts?.reactions || 0} viewCount={interactions?.counts?.views || 0} />

      {/* Post Footer */}
      <div className={styles.footer}>
        <ReactionButton
          postId={post._id}
          reactionCount={interactions?.counts?.reactions || 0}
          hasReacted={interactions?.userInteraction?.hasReacted || false}
          userReactionType={interactions?.userInteraction?.reactionType}
          reactionBreakdown={interactions?.reactionBreakdown}
        />
        <button className={styles.interactionButton} disabled>
          <BiComment size={18} />
          <span>Comment</span>
          {interactions?.counts?.comments > 0 && <span className={styles.count}>({interactions.counts.comments})</span>}
        </button>
        <button className={styles.interactionButton} disabled>
          <RiShareForwardLine size={18} />
          <span>Share</span>
          {interactions?.counts?.shares > 0 && <span className={styles.count}>({interactions.counts.shares})</span>}
        </button>
      </div>
    </div>
  );
};

export default Post;
