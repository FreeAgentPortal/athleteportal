'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Post } from '@/types/ISocialPost';
import styles from './TextWithMediaCard.module.scss';

interface TextWithMediaCardProps {
  post: Post;
}

const MAX_CHARS = 300;

const TextWithMediaCard = ({ post }: TextWithMediaCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const mediaItems = post.media || [];
  const shouldTruncate = post.body && post.body.length > MAX_CHARS;

  const renderMediaItem = (media: any, index: number) => {
    if (media.kind === 'video') {
      // Extract video ID and create proper embed URL with parameters
      const videoId = media.url.split('/').pop()?.split('?')[0];
      const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
      const thumbnailUrl = media.thumbUrl || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

      return (
        <div className={styles.videoWrapper}>
          <div className={styles.videoThumbnail} style={{ backgroundImage: `url(${thumbnailUrl})` }}>
            <iframe
              src={embedUrl}
              title="YouTube video"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className={styles.videoIframe}
              loading="lazy"
            />
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
    </div>
  );
};

export default TextWithMediaCard;
