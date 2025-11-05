'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useApiHook from '@/hooks/useApi';
import styles from './CommentsList.module.scss';

interface CommentsListProps {
  postId: string;
}

const CommentsList = ({ postId }: CommentsListProps) => {
  const {
    data: commentsData,
    isLoading,
    error,
  } = useApiHook({
    key: ['comments', postId],
    method: 'GET',
    url: `/feed/post/${postId}/comments`,
    showErrorAlert: false,
  }) as any;

  const comments = commentsData?.payload || [];

  if (isLoading) {
    return (
      <div className={styles.commentsList}>
        <div className={styles.loading}>Loading comments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.commentsList}>
        <div className={styles.error}>Failed to load comments</div>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className={styles.commentsList}>
        <div className={styles.emptyState}>
          <p>No comments yet. Be the first to comment!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.commentsList}>
      {comments.map((comment: any) => (
        <div key={comment._id} className={styles.comment}>
          {/* TODO: Render individual comment */}
          <p>{comment.text}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentsList;
