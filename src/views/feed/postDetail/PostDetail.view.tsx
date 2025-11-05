'use client';
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from '@/utils/axios';
import { Post as PostType } from '@/types/ISocialPost';
import Image from 'next/image';
import { IoArrowBack } from 'react-icons/io5';
import { BiComment } from 'react-icons/bi';
import { RiShareForwardLine } from 'react-icons/ri';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import ReactionButton from '@/views/feed/components/post/components/reactionButton/ReactionButton.component';
import ReactionSummary from '@/views/feed/components/post/components/reactionSummary/ReactionSummary.component';
import CommentInput from './components/commentInput/CommentInput.component';
import CommentsList from './components/commentList/CommentsList.component';
import { usePostView } from '@/views/feed/components/post/hooks/usePostView';
import styles from './PostDetail.module.scss';
import useApiHook from '@/hooks/useApi';

dayjs.extend(relativeTime);

interface PostDetailProps {
  postId: string;
}

const PostDetail = ({ postId }: PostDetailProps) => {
  const router = useRouter();

  const {
    data: postData,
    isLoading,
    error,
  } = useApiHook({
    key: ['post', postId],
    method: 'GET',
    url: `/feed/activity/${postId}`,
    showErrorAlert: false,
  }) as any;

  // Track post views - returns a callback ref
  const containerRef = usePostView({ postId, threshold: 5000 });

  const handleBack = () => {
    router.back();
  };

  const post: PostType | null = postData?.payload || null;
  const profile = post ? (post?.objectDetails as any)?.profile : null;
  const interactions = post ? (post as any)?.interactions : null;

  // Update document title based on post summary
  useEffect(() => {
    if (post?.body) {
      // Use first 60 characters of body as summary for title
      const summary = post.body.substring(0, 60) + (post.body.length > 60 ? '...' : '');
      document.title = `${summary} | Free Agent Portal`;
    }
    return () => {
      document.title = 'Free Agent Portal';
    };
  }, [post?.body]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading post...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Post not found</h2>
          <p>The post you're looking for doesn't exist or has been removed.</p>
          <button onClick={handleBack} className={styles.backButton}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const profileImageUrl = profile?.profileImageUrl;
  const authorName = profile?.fullName || 'Unknown';

  return (
    <div ref={containerRef} className={styles.container}>
      {/* Back Button */}
      <button onClick={handleBack} className={styles.backButton}>
        <IoArrowBack size={20} />
        <span>Back to Feed</span>
      </button>

      {/* Two Column Layout */}
      <div className={styles.contentGrid}>
        {/* Left Column - Post Card */}
        <div className={styles.postColumn}>
          <div className={styles.postCard}>
            {/* Post Header */}
            <div className={styles.postHeader}>
              <div className={styles.authorInfo}>
                <div className={styles.avatar}>
                  {profileImageUrl ? (
                    <Image src={profileImageUrl} alt={authorName} width={48} height={48} className={styles.avatarImage} />
                  ) : (
                    <div className={styles.avatarPlaceholder}>{authorName.charAt(0).toUpperCase()}</div>
                  )}
                </div>
                <div className={styles.authorDetails}>
                  <span className={styles.authorName}>{authorName}</span>
                  <span className={styles.timestamp}>{dayjs(post?.createdAt).fromNow()}</span>
                </div>
              </div>
            </div>

            {/* Post Content - Placeholder for now */}
            <div className={styles.postContent}>
              <p className={styles.contentPlaceholder}>Post content will be rendered here based on post type (text, media, event, etc.)</p>
            </div>

            {/* Engagement Bar */}
            <div className={styles.engagementBar}>
              <ReactionSummary
                reactionBreakdown={interactions?.reactionBreakdown}
                totalReactions={interactions?.counts?.reactions || 0}
                viewCount={interactions?.counts?.views || 0}
              />
            </div>

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <ReactionButton
                postId={post._id}
                reactionCount={interactions?.counts?.reactions || 0}
                hasReacted={interactions?.userInteraction?.hasReacted || false}
                userReactionType={interactions?.userInteraction?.reactionType}
                reactionBreakdown={interactions?.reactionBreakdown}
              />
              <button className={styles.actionButton}>
                <RiShareForwardLine size={20} />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Comments Section */}
        <div className={styles.commentsColumn}>
          <div className={styles.commentsSection}>
            <h3 className={styles.commentsTitle}>Comments ({interactions?.counts?.comments || 0})</h3>

            {/* Comment Input */}
            <CommentInput postId={post._id} profileImageUrl={profileImageUrl} authorName={authorName} />

            {/* Comments List */}
            <CommentsList postId={post._id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
