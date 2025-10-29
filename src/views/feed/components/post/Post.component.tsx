'use client';
import React from 'react';
import Image from 'next/image';
import { AiOutlineLike } from 'react-icons/ai';
import { BiComment } from 'react-icons/bi';
import { RiShareForwardLine } from 'react-icons/ri';
import { Post as PostType } from '@/types/ISocialPost';
import { determinePostType } from './utils/determinePostType';
import TextOnlyCard from './cards/textOnlyCard/TextOnlyCard.component';
import MediaOnlyCard from './cards/mediaOnlyCard/MediaOnlyCard.component';
import TextWithMediaCard from './cards/textWithMediaCard/TextWithMediaCard.component';
import styles from './Post.module.scss';

interface PostProps {
  post: PostType;
}

const Post = ({ post }: PostProps) => { 
  const postType = determinePostType(post.objectDetails);

  const renderPostContent = (postDetails: PostType) => {
    switch (postType) {
      case 'text-only':
        return <TextOnlyCard post={postDetails} />;
      case 'media-only':
        return <MediaOnlyCard post={postDetails} />;
      case 'text-with-media':
        return <TextWithMediaCard post={postDetails} />;
      default:
        return <TextOnlyCard post={postDetails} />;
    }
  };

  const profile = (post?.objectDetails as any)?.profile;
  const profileImageUrl = profile?.profileImageUrl;
  const authorName = profile?.email?.split('@')[0] || 'Unknown User';

  return (
    <div className={styles.container}>
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
            <span className={styles.timestamp}>{new Date(post?.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className={styles.actions}>
          {/* TODO: Add post menu (edit, delete, etc.) */}
          <button className={styles.menuButton}>⋯</button>
        </div>
      </div>

      {/* Post Content - Dynamic based on type */}
      <div className={styles.content}>{renderPostContent(post.objectDetails as any)}</div>

      {/* Post Footer */}
      <div className={styles.footer}>
        <button className={styles.interactionButton}>
          <AiOutlineLike size={18} />
          <span>Like</span>
          {post?.counts?.reactions > 0 && <span className={styles.count}>({post.counts.reactions})</span>}
        </button>
        <button className={styles.interactionButton}>
          <BiComment size={18} />
          <span>Comment</span>
          {post?.counts?.comments > 0 && <span className={styles.count}>({post.counts.comments})</span>}
        </button>
        <button className={styles.interactionButton}>
          <RiShareForwardLine size={18} />
          <span>Share</span>
          {post?.counts?.shares > 0 && <span className={styles.count}>({post.counts.shares})</span>}
        </button>
      </div>
    </div>
  );
};

export default Post;
