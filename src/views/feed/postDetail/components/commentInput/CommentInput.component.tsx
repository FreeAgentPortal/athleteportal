'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import styles from './CommentInput.module.scss';

interface CommentInputProps {
  postId: string;
  profileImageUrl?: string;
  authorName?: string;
}

const CommentInput = ({ postId, profileImageUrl, authorName }: CommentInputProps) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // TODO: Implement API call to post comment
      console.log('Posting comment:', { postId, comment });

      // Reset after successful post
      setComment('');
    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={styles.commentInput}>
      <div className={styles.avatar}>
        {profileImageUrl ? (
          <Image src={profileImageUrl} alt="Your avatar" width={32} height={32} className={styles.avatarImage} />
        ) : (
          <div className={styles.avatarPlaceholder}>{authorName?.charAt(0).toUpperCase() || 'U'}</div>
        )}
      </div>
      <input
        type="text"
        className={styles.input}
        placeholder="Write a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isSubmitting}
      />
      {comment.trim() && (
        <button className={styles.submitButton} onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Posting...' : 'Post'}
        </button>
      )}
    </div>
  );
};

export default CommentInput;
