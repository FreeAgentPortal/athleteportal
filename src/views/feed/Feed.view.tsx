'use client';
import React, { useRef } from 'react';
import Masonry from 'react-masonry-css';
import styles from './Feed.module.scss';
import { useFeed } from './useFeed';
import CreatePost from './components/createPost/CreatePost.component';
import Post from './post/Post.component';
import FeedTour from './components/feedTour/FeedTour.component';

const Feed = () => {
  const createPostRef = useRef<HTMLDivElement>(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useFeed();

  // Flatten all pages of posts into a single array
  const posts = data?.pages.flatMap((page) => page.data) || [];

  // Masonry breakpoint columns
  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  return (
    <div className={styles.container}>
      {/* Post Creation Section */}
      <div ref={createPostRef} className={styles.createPostContainer}>
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
            <Masonry breakpointCols={breakpointColumnsObj} className={styles.masonryGrid} columnClassName={styles.masonryGridColumn}>
              {posts.map((post: any, index: number) => (
                <Post key={post._id || index} post={post} />
              ))}
            </Masonry>

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

      {/* Feed Tour */}
      <FeedTour createPostRef={createPostRef} />
    </div>
  );
};

export default Feed;
