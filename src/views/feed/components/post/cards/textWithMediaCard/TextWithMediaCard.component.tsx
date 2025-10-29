'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Post } from '@/types/ISocialPost';
import VideoViewerModal from '@/views/feed/modals/videoViewerModal/VideoViewerModal.component';
import styles from './TextWithMediaCard.module.scss';

interface TextWithMediaCardProps {
  post: Post;
}

const MAX_CHARS = 300;

const TextWithMediaCard = ({ post }: TextWithMediaCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null);
  const mediaItems = post.media || [];
  const shouldTruncate = post.body && post.body.length > MAX_CHARS;
  const videos = mediaItems.filter((m) => m.kind === 'video').map((media) => ({ url: media.url, thumbUrl: media.thumbUrl }));

  const handleMediaClick = (index: number) => {
    const item = mediaItems[index];
    if (item.kind === 'video') {
      const videoOnlyIndex = mediaItems.slice(0, index + 1).filter((m) => m.kind === 'video').length - 1;
      setSelectedVideoIndex(videoOnlyIndex);
    }
  };

  const renderMediaItem = (media: any, index: number) => {
    if (media.kind === 'video') {
      // Show thumbnail only - clicking will open modal
      const videoId = media.url.split('/').pop()?.split('?')[0];
      const thumbnailUrl = media.thumbUrl || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

      return (
        <div className={styles.videoThumbnailWrapper} onClick={() => handleMediaClick(index)}>
          <img src={thumbnailUrl} alt="Video thumbnail" className={styles.videoThumbnailImage} />
          <div className={styles.playIcon}>
            <svg width="68" height="48" viewBox="0 0 68 48" fill="none">
              <path
                d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z"
                fill="red"
              />
              <path d="M45 24L27 14v20" fill="white" />
            </svg>
          </div>
        </div>
      );
    }

    return <Image src={media.url} alt={`Post media ${index + 1}`} width={300} height={300} className={styles.mediaImage} />;
  };

  return (
    <div className={styles.container}>
      {/* Text Content */}
      <div className={styles.textContent}>
        <motion.div
          initial={false}
          animate={{
            height: isExpanded ? 'auto' : shouldTruncate ? '4.5em' : 'auto',
            opacity: 1,
          }}
          transition={{
            height: { duration: 0.3, ease: 'easeInOut' },
            opacity: { duration: 0.2 },
          }}
          style={{ overflow: 'hidden' }}
        >
          <motion.p className={styles.body} initial={false} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
            {post.body}
          </motion.p>
        </motion.div>
        {shouldTruncate && (
          <motion.button className={styles.seeMoreButton} onClick={() => setIsExpanded(!isExpanded)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            {isExpanded ? 'See Less' : 'See More'}
          </motion.button>
        )}
      </div>

      {/* Media Content */}
      <div className={styles.mediaContent}>
        {mediaItems.length === 1 ? (
          <div className={styles.singleMedia}>{renderMediaItem(mediaItems[0], 0)}</div>
        ) : (
          <div className={styles.mediaGrid}>
            {mediaItems.slice(0, 4).map((media, index) => (
              <div key={index} className={styles.mediaItem}>
                {renderMediaItem(media, index)}
                {index === 3 && mediaItems.length > 4 && (
                  <div className={styles.moreOverlay}>
                    <span>+{mediaItems.length - 4}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Viewer Modal */}
      <VideoViewerModal
        visible={selectedVideoIndex !== null}
        videos={videos}
        currentIndex={selectedVideoIndex ?? 0}
        onClose={() => setSelectedVideoIndex(null)}
        onNext={() => {
          if (selectedVideoIndex !== null && selectedVideoIndex < videos.length - 1) {
            setSelectedVideoIndex(selectedVideoIndex + 1);
          }
        }}
        onPrevious={() => {
          if (selectedVideoIndex !== null && selectedVideoIndex > 0) {
            setSelectedVideoIndex(selectedVideoIndex - 1);
          }
        }}
      />
    </div>
  );
};

export default TextWithMediaCard;
