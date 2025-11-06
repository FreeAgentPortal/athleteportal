'use client';
import React from 'react';
import styles from './Feed.module.scss';
import { useFeed } from './useFeed';
import CreatePost from './components/createPost/CreatePost.component';
import Post from './post/Post.component';

const Feed = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useFeed();

  // Flatten all pages of posts into a single array
  const posts = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div className={styles.container}>
      {/* Post Creation Section */}
      <div className={styles.createPostContainer}>
        <CreatePost />
      </div>

      {/* Feed Content Section */}
      <div className={styles.feedContainer}>
        {isLoading ? (
          <div className={styles.loadingState}>
            <p>Loading feed...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No posts yet. Be the first to share something!</p>
          </div>
        ) : (
          <>
            {posts.map((post: any, index: number) => (
              <Post key={post._id || index} post={post} />
            ))}

            {/* Load More Button */}
            {hasNextPage && (
              <div className={styles.loadMoreContainer}>
                <button className={styles.loadMoreButton} onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                  {isFetchingNextPage ? 'Loading more...' : 'Load More Posts'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Feed;
